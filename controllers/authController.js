const AppError=require('./../utils/AppError');
const catchAsync =require('./../utils/catchAsync');
const jwt =require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./../Model/usermodel')
const sendEmail = require('./../utils/email')

const signToken =id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN

    });

}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
  


exports.singup=catchAsync(async(req,res,next)=>{

const newUser=await User.create(req.body);
createSendToken(newUser,201,res);

})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  });

exports.forgetPassword = catchAsync(async (req, res, next) => {
    //1) get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    //2) generate the random reset token
   const resetToken = user.createPasswordResetToken();
   await user.save({validateBeforeSave : false});
 //  3) Send it to user's email

  
 
const resetURL = `https://euphonious-cat-ee7933.netlify.app/reset-password.html?token=${resetToken}`;
    
const message = `نسيت كلمة المرور الخاصة بك؟ اضغط على الرابط التالي لإعادة تعيينها: ${resetURL}\n\nإذا لم تكن أنت من طلب إعادة التعيين، يرجى تجاهل هذا البريد الإلكتروني.`;
   try {
     await sendEmail({
       email: user.email,
       subject: 'Your password reset token (valid for 10 min)',
       message
     });
 
     res.status(200).json({
       status: 'success',
       message: 'Token sent to email!'
     });
   } catch (err) {
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save({ validateBeforeSave: false });
 
     return next(
       new AppError('There was an error sending the email. Try again later!'),
       500
     );
   }
 });


exports.resetPassword =catchAsync(async(req,res,next)=>{
    const hashedToken =crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
    
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    
    
    })
    
    
        if (!user){
            return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

   
        createSendToken(user, 200, res);
        
  

})


exports.updatePassword = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Incorrect password', 401));}
    
   
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    


     createSendToken(user, 200, res);
   
});










exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires :new Date(Date.now() +10 *1000),
        httpOnly:true
    });
    res.status(200).json({ status: 'success' });

}

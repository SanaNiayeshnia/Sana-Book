'use strict'
let passwordIcon=document.getElementById('passwordIcon');
let usernameInput=document.getElementById('usernameInput');
let passwordInput=document.getElementById('passwordInput');
let emailInput=document.getElementById('emailInput');
let signupBtn=document.getElementById('signupBtn');
let signinBtn=document.getElementById('signinBtn');
let form=document.getElementById('signinForm');
let submitBtn=document.getElementById('submitBtn');
let emailFeedback=document.getElementById('emailFD');
let passwordFeedback=document.getElementById('passwordFD');
let usernameFeedback=document.getElementById('usernameFD');
let signupAlert=document.getElementById('signupToast');

window.addEventListener('load', ()=>{
//show the sections and hide the loader after 7 seconds
setTimeout(()=>{
  document.querySelector('.content').style.display='flex';
  document.querySelector('.loader').style.display='none';
},7000)

})

//changing the passwordIcon to show or hide the password
passwordIcon.addEventListener('click', ()=>{
  if(passwordIcon.classList.contains('fa-eye')){
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash')
    passwordInput.setAttribute('type', 'text');
  }
  else{
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
    passwordInput.setAttribute('type', 'password');
  }
})

//change the form from sign in to sign up

//load the signup page
function goToSignupForm(){
  signinBtn.classList.remove('active');
  signupBtn.classList.add('active');
  form.classList.remove('signin-form');
  form.classList.add('signup-form');
  submitBtn.innerHTML='ثبت نام';
  emailInput.nextElementSibling.innerHTML='وارد کردن آدرس ایمیل';
  passwordInput.nextElementSibling.innerHTML='تعیین رمز عبور';
  //reseting the form
  form.reset();
  document.querySelectorAll('.feedback').forEach((feedback)=>{
    feedback.innerHTML="";
  });
  document.querySelectorAll('.invalid-icon').forEach((icon)=>{
    icon.style.cssText='display: none !important';
    icon.nextElementSibling.firstElementChild.classList.remove('px-0');
  })
}
signupBtn.addEventListener('click', goToSignupForm);

//load the signin page
function goToSigninForm(){
  signupBtn.classList.remove('active');
  signinBtn.classList.add('active');
  form.classList.remove('signup-form');
  form.classList.add('signin-form');
  submitBtn.innerHTML='ورود';
  emailInput.nextElementSibling.innerHTML='آدرس ایمیل';
  passwordInput.nextElementSibling.innerHTML='رمز عبور';
  //reseting the form
  form.reset();
  document.querySelectorAll('.feedback').forEach((feedback)=>{
    feedback.innerHTML="";
  });
  document.querySelectorAll('.invalid-icon').forEach((icon)=>{
    icon.style.cssText='display: none !important';
    icon.nextElementSibling.firstElementChild.classList.remove('px-0');
  })
 
}
signinBtn.addEventListener('click', goToSigninForm);

//change between inputs by keyboard
usernameInput.addEventListener('keydown', (e)=>{
  if(e.keyCode===13 || e.keyCode===40)
  emailInput.focus();
})
emailInput.addEventListener('keydown', (e)=>{
  if(e.keyCode===13 || e.keyCode===40)
  passwordInput.focus();
  else if(e.keyCode===38)
  usernameInput.focus();
})
passwordInput.addEventListener('keydown', (e)=>{
  if(e.keyCode===38)
  emailInput.focus();
})

//validating the login form
//validating the username input
let usernamePattern=/^(?!.*[!@#$%^&*()\-+\/\\,;:'"?=]).+$/;
function usernameValidation(){
  if(!usernamePattern.test(usernameInput.value)){
    usernameFeedback.innerHTML='نام کاربری نباید شامل کاراکتری به جز _ باشد.';
    usernameFeedback.style.display='flex';
    usernameFeedback.previousElementSibling.classList.remove('mb-3');
    usernameFeedback.previousElementSibling.classList.add('mb-1');
    //show the invalid icon
    usernameInput.parentElement.previousElementSibling.style.cssText='display: inline-block !important';
    usernameInput.classList.add('px-0');
    return false;

  }
  else{
    usernameFeedback.style.display='none';
    usernameFeedback.previousElementSibling.classList.remove('mb-1');
    usernameFeedback.previousElementSibling.classList.add('mb-3');
    //hide the invalid icon
    usernameInput.parentElement.previousElementSibling.style.cssText='display: none !important';
    usernameInput.classList.remove('px-0');
    return true;
  }
}
//validating the email input
let emailPattern=/.+@(yahoo|gmail|mail|outlook)\.com/;
function emailValidation(){
  if(!emailPattern.test(emailInput.value)){
    emailFeedback.innerHTML='الگوی ایمیل وارد شده صحیح نمی‌باشد.';
    emailFeedback.style.display='flex';
    emailFeedback.previousElementSibling.classList.remove('mb-3');
    emailFeedback.previousElementSibling.classList.add('mb-1');
    //show the invalid icon
    emailInput.parentElement.previousElementSibling.style.cssText='display: inline-block !important';
    emailInput.classList.add('px-0');
    return false;

  }
  else{
    emailFeedback.style.display='none';
    emailFeedback.previousElementSibling.classList.remove('mb-1');
    emailFeedback.previousElementSibling.classList.add('mb-3');
    //hide the invalid icon
    emailInput.parentElement.previousElementSibling.style.cssText='display: none !important';
    emailInput.classList.remove('px-0');
    return true;
  }
}


//validating the email input
let passwordPattern=/^(?=.*[a-z A-Z])(?=.*[0-9])(?!.*[!@#$%^&*()_\-+\/\\,;:'"?=]).{8,}$/;
function passwordValidation(){
  if(!passwordPattern.test(passwordInput.value)){
    passwordFeedback.innerHTML='رمز عبور شما باید حداقل 8 کاراکتر و فقط شامل حروف و اعداد باشد.';
    passwordFeedback.style.display='flex';
    passwordFeedback.previousElementSibling.classList.remove('mb-3');
    passwordFeedback.previousElementSibling.classList.add('mb-1');
    //show the invalid icon
    passwordInput.parentElement.previousElementSibling.style.cssText='display: inline-block !important';
    passwordInput.classList.add('px-0');
    return false;

  }
  else{
    passwordFeedback.style.display='none';
    passwordFeedback.previousElementSibling.classList.remove('mb-1');
    passwordFeedback.previousElementSibling.classList.add('mb-3');
    //hide the invalid icon
    passwordInput.parentElement.previousElementSibling.style.cssText='display: none !important';
    passwordInput.classList.remove('px-0');
    return true;
  }
}

//clicking on submit button
submitBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  //check validations
  let isUsernameValidated=usernameValidation();
  let isEmailValidated=emailValidation();
  let isPasswordValidated=passwordValidation();
  usernameInput.addEventListener('keyup', ()=>{
    isUsernameValidated=usernameValidation();
  })
  emailInput.addEventListener('keyup', ()=>{
  isEmailValidated= emailValidation();
  })
  passwordInput.addEventListener('keyup', ()=>{
  isPasswordValidated= passwordValidation();
  })

  //go to the sign in form when the user signed up
  if (signupBtn.classList.contains('active') && (isEmailValidated&&isPasswordValidated&&isUsernameValidated)){
    goToSigninForm();
    let signupToast = new bootstrap.Toast(signupAlert);
    signupToast.show();
  }
})


const validateName = (name) => {
    // Must be at least 3 characters long and consist of only letters
    const nameRegex = /^[a-zA-Z]{3,}$/;
    return nameRegex.test(name);
}


const validateEmail = (email) => {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,"gm");
    return emailRegex.test(email);
}

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(password);
}

module.exports = {validateEmail, validateName, validatePassword};
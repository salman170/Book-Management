
// ------------- validation of user title -------------
const validTitle = function (value) {
    if (typeof value !== "string") { return false }
    else {
        let titles = ["Mr", "Mrs", "Miss"]
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] == value.trim()) { return true }
        }
        return false
    }
}

// ------------- validation of user name -------------

const validName = function (value) {
    if (typeof value == "string") {
        if (value.trim() !== "") {
            let regex = /^([a-zA-Z .]){2,30}$/
            return regex.test(value.trim())
        } else { return false }
    } else { return false }
}

// ------------- validation of phone no. -------------

const validPhone = function (value) {
    let regex = /^[6-9]{1}[0-9]{9}$/
    return regex.test(value.toString().trim())

}

// ------------- validation of email -------------

const validEmail = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let firstLetter = /^(?=.*[A-Za-z])/
        let isValid = /^[a-zA-Z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
        if (firstLetter.test(value.trim()[0]) && isValid.test(value.trim())) { return true }
        else { return false }
    }
}

// ------------- validation of password -------------

const validPassword = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    else {
        let isValid = /^(?!.* )(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,15}$/
        return isValid.test(value.trim());
    }
}

// ------------- validation of password -------------

const validStreet = function (value) {
    if (typeof value == "string") {
        if (value.trim() !== "") {
            let regex = /^([a-zA-Z 0-9 .,-]){10,100}$/
            return regex.test(value.trim())
        } else { return false }
    } else { return false }
}

// --------------- this is for author validation -----------------

const validPincode = function (value) {
    if (typeof value !== "string" || value.trim() == "") { return false }
    var isValid = /^([0-9]){6}$/
    return isValid.test(value.trim());
}


module.exports = { validTitle, validName, validPhone, validEmail, validPassword, validStreet, validPincode }
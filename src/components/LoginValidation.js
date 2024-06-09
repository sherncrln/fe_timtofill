export default function Validation(values) {
    let error = {}
    const username_pattern = /^[0-9]{8,}$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.username === ""){
        error.username = "Username should not be empty"
    }else if(!username_pattern.test(values.username)){
        error.username = "Username did not match"
    }else{
        error.username = ""
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }else if(!password_pattern.test(values.password)){
        error.password = "Password did nxt match"
    }else{
        error.password = ""
    }

    return error;
}
import React, {PropTypes} from "react";
import LoginForm from "./LoginForm";
import Auth from "../Auth/Auth.js";

const config = require('../../../../config/config.json');
class LoginPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errors:{},
            userInfo: {
                email: "",
                password: ""
            }
        };
        this.processForm = this.processForm.bind(this);
        this.changeUserInfo = this.changeUserInfo.bind(this);
    }

    processForm(event) {
        event.preventDefault();
        const email = this.state.userInfo.email;
        const password = this.state.userInfo.password;
        const domain = config.webServer.domain;
        const port = config.webServer.port;
        const url = "http://" + domain + ":" + port + "/auth/login";
        fetch(url, {
            method: 'POST',
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if (response.status === 200) {
                console.log("login successful");
                this.setState({
                    errors: {}
                });
                response.json().then((json) => {
                    console.log(json);
                    Auth.authenticateUser(json.token, email, json.data);
                    this.context.router.replace('/');
                });
            }
            else {
                console.log("login failed");
                response.json().then((json) => {
                    const errors = json.errors? json.errors:{};
                    errors.summary = json.message;
                    this.setState({errors});
                });
            }
        })
    }

    changeUserInfo(event) {
        const field = event.target.name;
        const userInfo = this.state.userInfo;
        userInfo[field] = event.target.value;
        this.setState({userInfo});
    } 

    render(){
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUserInfo}
                errors={this.state.errors}
                userInfo={this.state.userInfo}
            />
        )
    }   
}

// To make react-router work
LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};
export default LoginPage;
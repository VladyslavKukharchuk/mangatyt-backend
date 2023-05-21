import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
class CognitoGateway {
  private cognitoServiceProvider: CognitoIdentityServiceProvider;
  private clientId: string;
  private userPoolId: string;
  constructor() {
    this.cognitoServiceProvider = new CognitoIdentityServiceProvider({
      region: process.env.AWS_REGION,
    });
    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
  }

  async register(password: string, email: string) {
    return this.cognitoServiceProvider
      .signUp({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email }],
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async confirmRegister(username: string, code: string) {
    return this.cognitoServiceProvider
      .confirmSignUp({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async login(email: string, password: string) {
    return this.cognitoServiceProvider
      .initiateAuth({
        ClientId: this.clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async forgotPassword(email: string) {
    return this.cognitoServiceProvider
      .forgotPassword({
        ClientId: this.clientId,
        Username: email,
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async confirmForgotPassword(
    confirmationCode: string,
    newPassword: string,
    email: string,
  ) {
    return this.cognitoServiceProvider
      .confirmForgotPassword({
        ClientId: this.clientId,
        ConfirmationCode: confirmationCode,
        Username: email,
        Password: newPassword,
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async changePassword(
    accessToken: string,
    oldPassword: string,
    newPassword: string,
  ) {
    return this.cognitoServiceProvider
      .changePassword({
        AccessToken: accessToken,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async findUsers(filter: string) {
    return this.cognitoServiceProvider
      .listUsers({
        UserPoolId: this.userPoolId,
        Filter: filter,
      })
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async findUserByEmail(email: string) {
    const data = await this.findUsers(`email = "${email}"`);
    return data.Users.length === 1 ? data.Users[0] : undefined;
  }

  async deleteUser(accessToken) {
    const command = {
      AccessToken: accessToken,
    };

    return this.cognitoServiceProvider
      .deleteUser(command)
      .promise()
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}

export default CognitoGateway;

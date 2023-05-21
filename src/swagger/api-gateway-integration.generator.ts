import { OpenAPIObject } from '@nestjs/swagger';

export class ApiGatewayIntegrationGenerator {
  public readonly ExtensionName: string = 'x-amazon-apigateway-integration';
  public constructor(private readonly baseConfiguration: any) {}

  public generateAmazonOpenApiOperationExtension(
    path: string,
    operation: string,
  ) {
    const {
      connectionId,
      type,
      passthroughBehavior,
      baseUri,
      connectionType,
      defaultResponseStatusCode,
    } = this.baseConfiguration;

    const gatewayExtension = {
      connectionId: connectionId,
      httpMethod: operation.toUpperCase(),
      type: type,
      passthroughBehavior: passthroughBehavior,
      uri: { 'Fn::Sub': `${baseUri}${path}` },
      connectionType: connectionType,
      responses: {
        default: {
          statusCode: defaultResponseStatusCode,
        },
      },
      requestParameters: undefined,
    };

    const parsedParameters: Map<string | number, string> =
      this.createParameterList(path);

    if (parsedParameters.size > 0) {
      gatewayExtension.requestParameters = Object.fromEntries(parsedParameters);
    }

    return gatewayExtension;
  }
  // We need to tell aws about each parameter on the api so here we
  // loop through them all and create entries
  // I just use a regex to look for them in the already available
  // url from the swagger plugin
  public createParameterList(urlPath: string): Map<string | number, string> {
    const ENDPOINTS_LIMIT = 1000;
    const generatedList: Map<string | number, string> = new Map<
      string | number,
      string
    >();
    let match: RegExpExecArray | null;

    const parameterRegEx = /\/{(\w+)/g;

    for (let i = 0; i < ENDPOINTS_LIMIT; i++) {
      match = parameterRegEx.exec(urlPath);
      if (match === undefined || match === null) {
        break;
      }

      generatedList.set(
        `integration.request.path.${match[1]}`,
        `method.request.path.${match[1]}`,
      );
    }

    return generatedList;
  }

  public addToAllPaths(document: OpenAPIObject): OpenAPIObject {
    Object.keys(document.paths).forEach((path: string) => {
      const currentPath = (
        document.paths as {
          [index: string]: any;
        }
      )[path];
      Object.keys(currentPath).forEach((operation: string) => {
        const currentOperation = (
          currentPath as {
            [index: string]: any;
          }
        )[operation];

        const gatewayExtension = this.generateAmazonOpenApiOperationExtension(
          path,
          operation,
        );

        Object.assign(currentOperation, {
          [this.ExtensionName]: gatewayExtension,
        });
      });
    });

    return JSON.parse(JSON.stringify(document));
  }
}

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { stringify } from 'yaml';
import * as fs from 'fs';
import { ApiGatewayIntegrationGenerator } from '@src/swagger/api-gateway-integration.generator';

const options: SwaggerDocumentOptions = {
  deepScanRoutes: true,
};
export default (app) => {
  const config = new DocumentBuilder()
    .setTitle('Project')
    .setDescription('Project API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  let document = SwaggerModule.createDocument(app, config, options);
  // then we take that standard js oject and whatever new properties we need
  document = new ApiGatewayIntegrationGenerator({
    type: 'http_proxy',
    passthroughBehavior: 'when_no_match',
    baseUri: 'http://${LoadBalancerDnsName}:${AppPort}',
    connectionType: 'VPC_LINK',
    defaultResponseStatusCode: '200',
    connectionId: { Ref: 'VpcLink' },
    responses: '*x-integration-responses',
  }).addToAllPaths(document);
  // convert it to yaml
  const yamlString: string = stringify(document);
  // and save it
  fs.writeFileSync('./open-api-spec/api-doc.yaml', yamlString);
  SwaggerModule.setup('api', app, document);
};

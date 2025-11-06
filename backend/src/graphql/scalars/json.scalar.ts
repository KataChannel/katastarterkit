import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

@Scalar('JSON', () => JSON)
export class JSONScalar implements CustomScalar<any, any> {
  description = 'JSON custom scalar type';

  parseValue(value: any): any {
    return GraphQLJSON.parseValue(value);
  }

  serialize(value: any): any {
    return GraphQLJSON.serialize(value);
  }

  parseLiteral(ast: ValueNode): any {
    return GraphQLJSON.parseLiteral(ast, {});
  }
}

@Scalar('JSONObject', () => Object)
export class JSONObjectScalar implements CustomScalar<any, any> {
  description = 'JSON object scalar type';

  parseValue(value: any): any {
    return GraphQLJSONObject.parseValue(value);
  }

  serialize(value: any): any {
    return GraphQLJSONObject.serialize(value);
  }

  parseLiteral(ast: ValueNode): any {
    return GraphQLJSONObject.parseLiteral(ast, {});
  }
}

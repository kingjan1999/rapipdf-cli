import fsp from "fs/promises";
import fs from "fs";
import path from "path";
import { Command, flags } from "@oclif/command";
import jsyaml from "js-yaml";
import createPdf from "./rapipdf/pdf-gen";

class RapipdfCliCommand extends Command {
  async run() {
    const { flags, args } = this.parse(RapipdfCliCommand);
    const outputFile = flags.outputFile || "api.pdf";

    const fileContent = await fsp.readFile(args.file);
    let parsedSpec = {};

    if (/(yaml|yaml)$/.test(args.file)) {
      parsedSpec = jsyaml.load(fileContent);
    } else {
      parsedSpec = JSON.parse(fileContent);
    }

    let config = {
      pdfSortTags: true,
      localize: {
        index: "INDEX",
        api: "API",
        apiList: "API List",
        apiReference: "API Reference",
        apiVersion: "API Version",
        contact: "CONTACT",
        name: "NAME",
        email: "EMAIL",
        url: "URL",
        termsOfService: "Terms of service",
        securityAndAuthentication: "Security and Authentication",
        securitySchemes: "SECURITY SCHEMES",
        key: "KEY",
        type: "TYPE",
        example: "EXAMPLE",
        description: "DESCRIPTION",
        request: "REQUEST",
        requestBody: "REQUEST BODY",
        response: "RESPONSE",
        responseModel: "RESPONSE MODEL",
        statusCode: "STATUS CODE",
        deprecated: "DEPRECATED",
        allowed: "ALLOWED",
        default: "DEFAULT",
        readOnly: "READ ONLY",
        writeOnly: "WRITE ONLY",
        enumValues: "ENUM",
        pattern: "PATTERN",
        parameters: "Parameters",
        noRequestParameters: "No request parameters",
        method: "METHOD",
        pageNumber: "%s of %s",
      },
      pdfTitle: "API Reference",
      pdfCoverText: "Cover-Text",
      pdfSchemaStyle: "table",
      includeToc: true,
      includeApiList: false,
      includeApiDetails: true,
      includeSecurity: true,
      includeInfo: true,
      includeExample: true,
    };

    if (flags.configFile) {
      const absolutePath = path.resolve(flags.configFile);
      if (!fs.existsSync(absolutePath)) {
        this.error(`File ${absolutePath} does not exist.`, { exit: true });
      }
      const loadedConfig = JSON.parse(await fsp.readFile(absolutePath, 'utf8'));
      config = {
        ...config,
        ...loadedConfig,
      };
    }

    await createPdf(parsedSpec, {
      ...config,
      outputFile,
    });

    this.log(`PDF created at ${outputFile}`);
  }
}

RapipdfCliCommand.description = `Generate PDfs for OpenAPI files

`;

RapipdfCliCommand.args = [{ name: "file", required: true }];

RapipdfCliCommand.flags = {
  version: flags.version({ char: "v" }),
  help: flags.help({ char: "h" }),
  outputFile: flags.string({ char: "o", description: "output file" }),
  configFile: flags.string({ char: "c", description: "config file" }),
};

RapipdfCliCommand.conf

module.exports = RapipdfCliCommand;

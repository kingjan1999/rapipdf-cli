import fsp from "fs/promises";
import fs from "fs";
import path from "path";
import { Flags, Command } from "@oclif/core";
import jsyaml from "js-yaml";
import createPdf from "../../rapipdf/pdf-gen";

class RapipdfCliCommand extends Command {
  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help({ char: "h" }),
    outputFile: Flags.string({ char: "o", description: "output file" }),
    configFile: Flags.string({ char: "c", description: "config file" }),
  };

  static description = `Generate PDfs for OpenAPI files

  `;

  static args = [{ name: "file", required: true }];

  async run() {
    const { flags, args } = await this.parse(RapipdfCliCommand);
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
      const loadedConfig = JSON.parse(await fsp.readFile(absolutePath, "utf8"));
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

module.exports = RapipdfCliCommand;

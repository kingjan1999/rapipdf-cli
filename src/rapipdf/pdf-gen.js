import ProcessSpec from "./spec-parser";
import {
  getInfoDef,
  getSecurityDef,
  getApiDef,
  getApiListDef,
} from "./pdf-parts-gen";
import PdfPrinter from "@kingjan1999/pdfmake";
import URLResolver from "@kingjan1999/pdfmake/js/URLResolver";
import { sprintf } from "sprintf-js";

export default async function createPdf(spec, options) {
  const parsedSpec = await ProcessSpec(spec, options.pdfSortTags);

  const pdfStyles = {
    title: { fontSize: 32 },
    h1: { fontSize: 22 },
    h2: { fontSize: 20 },
    h3: { fontSize: 18 },
    h4: { fontSize: 16 },
    h5: { fontSize: 14 },
    h6: { fontSize: 12, bold: true },
    p: { fontSize: 12 },
    small: { fontSize: 10 },
    sub: { fontSize: 8 },
    right: { alignment: "right" },
    left: { alignment: "left" },
    topMargin1: { margin: [0, 180, 0, 10] },
    topMargin2: { margin: [0, 60, 0, 5] },
    topMargin3: { margin: [0, 20, 0, 3] },
    topMargin4: { margin: [0, 15, 0, 3] },
    topMarginRegular: { margin: [0, 3, 0, 0] },
    tableMargin: { margin: [0, 5, 0, 15] },
    b: { bold: true },
    i: { italics: true },
    primary: {
      color: options.pdfPrimaryColor ? options.pdfPrimaryColor : "#b44646",
    },
    alternate: {
      color: options.pdfAlternateColor ? options.pdfAlternateColor : "#005b96",
    },
    gray: { color: "gray" },
    lightGray: { color: "#aaaaaa" },
    darkGray: { color: "#666666" },
    red: { color: "orangered" },
    blue: { color: "#005b96" },
    mono: { font: "RobotoMono", fontSize: 10 },
    monoSub: { font: "RobotoMono", fontSize: 8 },
    ...(options.pdfStyles || {}),
  };

  const allContent = [];
  let infoDef = {};
  let tocDef = {};
  let securityDef = {};
  let apiListDef = {};
  let apiDef = {};

  if (options.logoTop) {
    const logoDef = {
      image: options.logoTop,
      style: { alignment: "center" },
      width: 200,
    };
    allContent.push(logoDef);
  }

  if (options.includeInfo) {
    infoDef = getInfoDef(parsedSpec, options.pdfTitle, options.localize);
    allContent.push(infoDef);
  }

  if (options.logoBottom) {
    const logoDef = {
      image: options.logoBottom,
      style: { alignment: "center" },
      width: 200,
      relativePosition: {x: 0, y: 200}
    };
    allContent.push(logoDef);
  }

  allContent.push({ text: "", pageBreak: "after" });

  if (options.includeToc) {
    tocDef = {
      toc: {
        title: { text: options.localize.index, style: ["b", "h2"] },
        numberStyle: { bold: true },
        style: ["small"],
      },
      pageBreak: "after",
    };
    // allContent.push({text:'', pageBreak:'after'});
    allContent.push(tocDef);
  }
  if (options.includeSecurity) {
    securityDef = getSecurityDef(parsedSpec, options.localize);
    allContent.push(securityDef);
  }
  if (options.includeApiDetails) {
    apiDef = getApiDef(
      parsedSpec,
      "",
      options.pdfSchemaStyle,
      options.localize,
      options.includeExample,
      options.includeApiList
    );
    allContent.push(apiDef);
  }
  if (options.includeApiList) {
    apiListDef = getApiListDef(
      parsedSpec,
      options.localize.apiList,
      options.localize
    );
    allContent.push(apiListDef);
  }

  const finalDocDef = {
    footer(currentPage, pageCount) {
      return {
        margin: 10,
        columns: [
          { text: options.pdfFooterText, style: ["sub", "gray", "left"] },
          {
            text: sprintf(options.localize.pageNumber, currentPage, pageCount),
            style: ["sub", "gray", "right"],
          },
        ],
      };
    },
    content: allContent,
    styles: pdfStyles,
    info: {
      title: options.pdfTitle,
      author:
        (parsedSpec.info &&
          parsedSpec.info.contact &&
          parsedSpec.info.contact.name) ||
        "RapiPDF CLI",
      producer: "RapiPDF CLI via pdfmake",
    },
  };

  const pdfMake = {};
  pdfMake.fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
      bold: "fonts/Roboto-Medium.ttf",
      italics: "fonts/Roboto-Italic.ttf",
      bolditalics: "fonts/Roboto-Medium.ttf",
    },
    RobotoMono: {
      normal: "fonts/RobotoMono-Regular.ttf",
      bold: "fonts/RobotoMono-Regular.ttf",
      italics: "fonts/RobotoMono-Regular.ttf",
      bolditalics: "fonts/RobotoMono-Regular.ttf",
    },
    ...(options.pdfFonts || {}),
  };

  PdfPrinter.fonts = pdfMake.fonts;
  PdfPrinter.urlResolver = new URLResolver(PdfPrinter.virtualfs);
  await PdfPrinter.createPdf(finalDocDef).write(options.outputFile);
}

import {
  resumeEngine,
} from "../engines/resume.engine.js";

import {
  codeEngine,
} from "../engines/code.engine.js";

import {
  sqlEngine,
} from "../engines/sql.engine.js";

import {
  websiteEngine,
} from "../engines/website.engine.js";

import {
  pdfEngine,
} from "../engines/pdf.engine.js";

import {
  documentEngine,
} from "../engines/document.engine.js";

import {
  emailEngine,
} from "../engines/email.engine.js";

import {
  blogEngine,
} from "../engines/blog.engine.js";

import {
  summaryEngine,
} from "../engines/summary.engine.js";

import {
  translatorEngine,
} from "../engines/translator.engine.js";

import {
  imageEngine,
} from "../engines/image.engine.js";

import {
  presentationEngine,
} from "../engines/presentation.engine.js";

import {
  generalEngine,
} from "../engines/general.engine.js";



export const aiToolRouter = (intent) => {

  switch(intent) {

    case "resume":
      return resumeEngine;


    case "code":
      return codeEngine;


    case "sql":
      return sqlEngine;


    case "website":
      return websiteEngine;


    case "pdf":
      return pdfEngine;


    case "document":
      return documentEngine;


    case "email":
      return emailEngine;


    case "blog":
      return blogEngine;


    case "summary":
      return summaryEngine;


    case "translator":
      return translatorEngine;


    case "image":
      return imageEngine;


    case "presentation":
      return presentationEngine;


    default:
      return generalEngine;
  }

};
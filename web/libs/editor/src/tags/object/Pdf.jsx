import { inject, observer } from "mobx-react";
import { types } from "mobx-state-tree";

import Registry from "../../core/Registry";
import { AnnotationMixin } from "../../mixins/AnnotationMixin";
import ProcessAttrsMixin from "../../mixins/ProcessAttrs";
import Base from "./Base";
import { parseValue } from "../../utils/data";

/**
 * The `Pdf` tag is used to display a PDF document from a URL.
 * @example
 * <View>
 *   <Pdf name="pdf-1" value="$pdf_url" />
 * </View>
 * @name Pdf
 * @meta_title Pdf Tag to Display PDF Documents
 * @meta_description Customize Label Studio by displaying PDF files in tasks for machine learning and data science projects.
 * @param {string} value Data field value containing the URL to the PDF
 */
const Model = types
  .model({
    type: "pdf",
    value: types.maybeNull(types.string),
    _url: types.maybeNull(types.string),
  })
  .actions((self) => ({
    updateValue(store) {
      // @todo check that the value is a valid URL and document exists
      self._url = parseValue(self.value, store.task.dataObj);
    },
  }));

const PdfModel = types.compose("PdfModel", Base, ProcessAttrsMixin, AnnotationMixin, Model);

const HtxPdf = inject("store")(
  observer(({ item }) => {
    if (!item._url) return null;
    return <embed src={item._url} style={{ width: "100%", height: "600px", border: "none" }} type="application/pdf" />;
  }),
);

if (!Registry.models.pdf) {
  Registry.addTag("pdf", PdfModel, HtxPdf);
  Registry.addObjectType(PdfModel);
}

export { HtxPdf, PdfModel };

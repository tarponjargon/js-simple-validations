import Util from "./utilities";
import FormValidator from "./form-validator";
import debounce from "./debounce-promise";
import "nodelist-foreach-polyfill";
import cfg from "./config";
import styles from "./styles.js";

(function(module) {
  //if (typeof module !== 'undefined') {
  /* eslint-disable no-undef */
  if (typeof window !== "undefined") {
    console.log("BROWSER", module);
    window.SimpleValidations = module.SimpleValidations;
  } else if (typeof define === "function" && define.amd) {
    console.log("AMD", module);
    define(function() {
      return module.SimpleValidations;
    });
  } else {
    console.log("MODULE", module);
    module.exports = module.SimpleValidations();
  }
  /* eslint-enable no-undef */
})({
  SimpleValidations: function() {
    let util = new Util();

    //merge any user-defined options into cfg
    window.validateOptions = window.validateOptions || {};
    if (
      "cfg" in window.validateOptions &&
      typeof window.validateOptions.cfg === "object"
    ) {
      for (let key in window.validateOptions.cfg) {
        cfg[key] = window.validateOptions.cfg[key];
      }
    }

    // exit if cfg disableValidations === true
    if (cfg.disableValidations !== "undefined" && cfg.disableValidations) {
      console.log("validations exiting");
      return false;
    }

    // add stylesheet/styles to window (if enabled)
    if (cfg.useCss) {
      try {
        let sht = document.createElement("style");
        sht.innerHTML = styles;
        document.head.appendChild(sht);
      } catch (e) {
        console.error("problem creating stylesheet");
      }
    } // end if for useCss

    // loop thru forms in DOM marked for validation
    document
      .querySelectorAll("[" + cfg.formValidateAttr + "]")
      .forEach(form => {
        // stores max configured debounce value on form
        let maxDebounce = cfg.debounceDefault;

        // add form-level error container (if not exists)
        let ferr = util.createValidationElement(form, cfg.formError);
        if (ferr) {
          form.insertBefore(ferr, form.firstChild);
        }

        // add form-level success container (if not exists)
        let fsucc = util.createValidationElement(form, cfg.formSuccess);
        if (fsucc) {
          form.appendChild(fsucc);
        }

        // disable form by default
        util.disableForm(form, true);

        let formValidator = new FormValidator(form);

        // loop thru fields in this form marked for validation
        form
          .querySelectorAll("[" + cfg.fieldValidators + "]")
          .forEach(field => {
            // reference ID to tie message container, etc to this field
            let baseId = util.getAttr(field, cfg.baseId);
            if (!baseId) {
              baseId = util.createId();
              field.setAttribute(cfg.baseId, baseId);
            }

            // add containing div around field to be validated (if not exists)
            // radio/checkboxes excluded because they have multiple elements
            // so the divs need to be added manually (if wanted)
            if (field.type !== "radio" && field.type !== "checkbox") {
              try {
                let cvt = util.getAttr(field, cfg.valTarget);
                let cv = cvt ? form.querySelector("#" + cvt) : null;
                if (!cv) {
                  let wrapId = "w-" + baseId;
                  let fc = util.createValidationElement(
                    field.parentNode,
                    cfg.fieldContainer,
                    wrapId
                  );
                  field.parentNode.appendChild(fc);
                  fc.appendChild(field);
                  field.setAttribute(cfg.valTarget, wrapId);
                }
              } catch (e) {
                console.error(
                  "problem wrapping field " +
                    field +
                    " with containing div" +
                    cfg.fieldContainer
                );
              }

              // add field-level error container (if not exists and not a custom one )
              try {
                let ces = util.getAttr(field, cfg.invMessage);
                let ce = ces ? form.querySelector("#" + ces) : null;
                if (!ce) {
                  let errId = "e-" + baseId;
                  let fe = util.createValidationElement(
                    field.parentNode,
                    cfg.fieldError,
                    errId
                  );
                  field.parentNode.parentNode.insertBefore(
                    fe,
                    field.parentNode.nextElementSibling
                  );
                  field.setAttribute(cfg.invMessage, errId);
                }
              } catch (e) {
                console.error("problem adding element " + cfg.fieldError);
              }
            } // end if for not radio or checkbox

            // check if field has a value already (like from the backend)
            // simulate a focusout event by sending an explicit event object
            try {
              let val = util.getValue(field);
              if (val && /\S/.test(val)) {
                formValidator.validate({
                  type: "focusout",
                  target: {
                    name: field.name
                  }
                });
              }
            } catch (e) {
              console.error("error checking for field value", e);
            }

            // set up debouncing of input
            let dbField = util.getAttr(field, cfg.fieldDebounce);
            let dbr =
              dbField && !isNaN(dbField) ? dbField : cfg.debounceDefault;
            if (dbr > maxDebounce) {
              maxDebounce = dbr;
            }
            let dbf = debounce(formValidator.validate, dbr);
            let dbw = function(e) {
              //console.log("debounceWrapper", e.type, form.getAttribute('name'), field.getAttribute('name'), field.getAttribute('id'), "deboucerate", dbRate);
              if (field.offsetParent !== null) {
                dbf(e, form)
                  .then(function() {})
                  .catch(function() {});
              }
            };

            // and add listeners to trigger form revalidation on any changes
            field.addEventListener("input", dbw, false);
            field.addEventListener("change", dbw, false);
            field.addEventListener("focusout", dbw, false);
          }); // end loop thru fields in form

        // form submit handler
        form.addEventListener("submit", function(e) {
          console.log("SUBMIT event", form, maxDebounce);
          e.preventDefault(); // we need to do a final validation first
          // run final validations AFTER maxDebounce to let all previous debounced operations clear
          setTimeout(() => {
            formValidator
              .validate(e, form)
              .then(function() {
                console.log("success!");

                let ref = cfg.formSubmitHandler
                  ? util.getAttr(form, cfg.formSubmitHandler)
                  : null;
                let aftr =
                  ref && ref in window && typeof window[ref] === "function"
                    ? window[ref]
                    : null;

                if (aftr) {
                  console.log("AFTERSUBMIT", e, form, "valid");
                  aftr(e, form, "valid");
                } else {
                  console.log("submitting form the traditional way");
                  form.submit();
                }
              })
              .catch(function() {
                let m =
                  util.getAttr(form, cfg.formInvalidMessage) ||
                  "Please correct the errors below";
                util.showMsg(form, cfg.formError.className, m);
              });
          }, maxDebounce + 100);
        });
      }); // end loop thru forms in window
  }
});

// make sure we're in a browser environment
if (typeof window !== "undefined" && "SimpleValidations" in window) {
  document.addEventListener("DOMContentLoaded", () =>
    window.SimpleValidations()
  );
}

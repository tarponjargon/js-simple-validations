import config from './validations-config.js'

const styles = ' \
	[data-jsv-form-tooltip] { \
	  position: relative; \
	  cursor: pointer; \
	  outline: none!important; \
	} \
	[data-jsv-form-tooltip]:before, \
	[data-jsv-form-tooltip] { \
	  position: relative; \
	  cursor: pointer; \
	} \
	[data-jsv-form-tooltip]:before, \
	[data-jsv-form-tooltip]:after { \
	  position: absolute; \
	  visibility: hidden; \
	  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; \
	  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0); \
	  opacity: 0; \
	  -webkit-transition: \
		  opacity 0.2s ease-in-out, \
			visibility 0.2s ease-in-out, \
			-webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
		-moz-transition: \
			opacity 0.2s ease-in-out, \
			visibility 0.2s ease-in-out, \
			-moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
		transition: \
			opacity 0.2s ease-in-out, \
			visibility 0.2s ease-in-out, \
			transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
	  -webkit-transform: translate3d(0, 0, 0); \
	  -moz-transform:    translate3d(0, 0, 0); \
	  transform:         translate3d(0, 0, 0); \
	  pointer-events: none; \
	} \
	[data-jsv-form-tooltip]:hover:before, \
	[data-jsv-form-tooltip]:hover:after { \
	  visibility: visible; \
	  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)"; \
	  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100); \
	  opacity: 1; \
	} \
	[data-jsv-form-tooltip]:before { \
	  border: 6px solid transparent; \
	  background: transparent; \
	  content: ""; \
	} \
	[data-jsv-form-tooltip]:after { \
	  padding: 8px; \
	  min-width: 120px; \
	  white-space: nowrap; \
	  background-color: #000; \
	  background-color: hsla(0, 0%, 20%, 0.9); \
	  color: #fff; \
	  content: attr(data-jsv-form-tooltip); \
	  font-size: 12px; \
	  line-height: 1.2; \
	} \
	[data-jsv-form-tooltip]:before, \
	[data-jsv-form-tooltip]:after { \
	  bottom: 100%; \
	  left: 50%; \
	} \
	[data-jsv-form-tooltip]:before { \
	  margin-left: -6px; \
	  margin-bottom: -12px; \
	  border-top-color: #000; \
	  border-top-color: hsla(0, 0%, 20%, 0.9); \
	} \
	[data-jsv-form-tooltip]:after { \
	  margin-left: -60px; \
	  z-index: 1; \
	} \
	[data-jsv-form-tooltip]:hover:before, \
	[data-jsv-form-tooltip]:hover:after { \
	  -webkit-transform: translateY(-12px); \
	  -moz-transform:    translateY(-12px); \
	  transform:         translateY(-12px); \
	} \
	.validate-form-error-message { \
		color: '+config.isInvalidColor+'; \
	} \
	.validate-form-error-message.well { \
		border-color: '+config.isInvalidColor+'; \
	} \
	.validate-form-success-message { \
		color: '+config.isValidColor+'; \
	} \
	.validate-form-success-message.well { \
		border-color: '+config.isValidColor+'; \
	} \
	.validate-field-error-message { \
		width: 100%; \
		display: block; \
		color: '+config.isInvalidColor+'; \
		font: '+config.fieldErrorFont+';	 \
	} \
	.validate-form-hidden-message { \
		display: none; \
	} \
	.button-success, .button-success:hover { \
		background-color: '+config.isValidColor+'; \
	} \
	.validate-input { \
		position: relative; \
	} \
	.validate-input.form-field-invalid input, \
	.validate-input.form-field-invalid textarea, \
	.validate-input.form-field-invalid select { \
		border: 1px solid '+config.isInvalidColor+'; \
	} \
	.validate-input.form-field-valid input, \
	.validate-input.form-field-valid textarea, \
	.validate-input.form-field-valid select { \
		border: 1px solid '+config.isValidColor+'; \
	} \
	.validate-input.form-field-valid-focusout::after { \
		content: "'+config.isValidIcon+'"; \
		color: '+config.isValidColor+';	 \
		right:20px; \
		top:9px; \
		position:absolute;     \
	} \
	.validate-input.form-field-invalid-focusout::after { \
		content: "'+config.isInvalidIcon+'"; \
		color: '+config.isInvalidColor+';	 \
		right:20px; \
		top:8px; \
		position:absolute; \
	} \
';

export default styles;

const katex = require("katex");
const lodash = require("lodash");
const camel = require("camel-case");

exports.onPreInit = () => console.log("Loaded gatsby-transformer-katex");

exports.onCreateNode = ({ node, actions }, pluginOptions) => {
  const process = pluginOptions.process || [];
  const item = process.find((item) => item.type === node.internal.type);
  if (item) {
    const { createNodeField } = actions;

    const fields = item.fields || [];

    fields.forEach((field) => {
      const content = lodash.get(node, field);

      if (content) {
        // Match only one, unescaped, $ sign delimiting inline math.
        const token = "literal_dollar_sign";
        const tokenized = content.replace(/\\\$/g, token);
        const katexProcessed = tokenized.replace(
          /\$(.+?)\$/g,
          (outer, inner) => {
            // Replace literal dollar sign within latex with escaped
            // dollar sign \$
            const tokenReplaced = inner.replace(new RegExp(token, "g"), `\\$`);
            try {
              return katex.renderToString(tokenReplaced, {
                throwOnError: !!pluginOptions.throwOnError,
                strict: (errorCode, errorMsg, token) => {
                  console.log(errorCode);
                  console.log(errorMsg);
                  console.log(token);
                  console.log(content);
                },
              });
            } catch (error) {
              if (error instanceof katex.ParseError) {
                console.error(error.message);
              } else {
                console.log(error);
              }
              console.error(content);
              return tokenReplaced;
            }
          }
        );
        // Replace literal dollar signs outside of latex.
        const contentProcessed = katexProcessed.replace(
          new RegExp(token, "g"),
          `$`
        );

        createNodeField({
          node,
          name: camel.camelCase(`${field}_katex`, {
            transform: camel.camelCaseTransformMerge,
          }),
          value: contentProcessed,
        });
      }
    });

    return {};
  }

  return {};
};

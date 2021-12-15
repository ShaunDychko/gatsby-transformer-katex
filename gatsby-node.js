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
        // See regex at: https://regexr.com/6aaj1
        const contentProcessed = content.replace(
          /(?<![\$\\])\${1}(?!\$)(.+?)\${1}/g,
          (outer, inner) => {
            return katex.renderToString(inner, {
              throwOnError: !!pluginOptions.throwOnError,
            });
          }
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

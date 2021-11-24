/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
exports.onPreInit = () => console.log("Loaded gatsby-transformer-katex");

exports.onCreateNode = ({ node, actions, reporter, createNodeId }) => {
  if (node.internal.owner !== "gatsby-source-drupal") {
    return {};
  }

  const node_types = ["node__page"];
  // reporter.info(node);

  if (node_types.includes(node.internal.type)) {
    const { createNode, createParentChildLink } = actions;
    // reporter.info(node);

    let content = node.body.processed;
    console.log(`The content: ${content}`);
    console.log(node);

    const katexNode = {
      id: createNodeId(`${node.id} >>> Katex`),
      children: [],
      parent: node.id,
      internal: {
        contentDigest: `${node.internal.contentDigest}`,
        type: `Katex`,
      },
    };

    katexNode.processedKatex = `${node.body.processed} has been processed!`;

    createNode(katexNode);
    createParentChildLink({ parent: node, child: katexNode });
    return katexNode;
  }

  return {};
};

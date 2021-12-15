## Description

The gatsby-transformer-katex plugin will process any specified text node with the [Katex](https://katex.org/) math typsetting library. This plugin renders any LaTeX enclosed between `$` signs in "inline mode".

## Dependencies

* [katex](https://www.npmjs.com/package/katex)
* [camel-case](https://www.npmjs.com/package/camel-case) To create the new field name that will appear in GraphiQL.
* [lodash](https://www.npmjs.com/package/lodash) To interpret the "dot notation" path to the GraphQL text node.

## How to install

`npm install gatsby-transformer-katex`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-katex`,
      options: {
        process: [
          {
            type: `node__article`,
            fields: [
              `body.processed`
            ]
          }
        ]
      }
    }
  ]
}
```

Inspect the GraphiQL output to identify the text node that you wish to process with Katex. Consider data that could be queried with the following:

```sql
query MyQuery {
  nodeArticle {
    internal {
      type
    }
    body {
      processed
    }
  }
}
```

Which outputs the following:

```
{
  "data": {
    "nodeArticle": {
      "internal": {
        "type": "node__article"
      },
      "body": {
        "processed": "<p>Some text... then some math! $e^{i \pi} = -1$</p>\n"
      }
    }
  },
  "extensions": {}
}
```

The `type` key in the gatsby-transformer-katex configuration is the value of the internal type of the graphQL node. In this example it is `node__article`. Each item in the `fields` array is a [dot notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors#dot_notation) path to the field starting within the data node. In this example the field is `body.processed`. The field can be arbitrarily nested with more dots. This example was created using the [gatsby-source-drupal](https://www.gatsbyjs.com/plugins/gatsby-source-drupal/) source plugin, but any source plugin that assigns an "internal.type" can be used (which is probably all of them?).

To use the Katex processed version of `body.processed`, adjust the GraphQL query as follows:

```
query MyQuery {
  nodeArticle {
    fields {
      bodyProcessedKatex
    }
  }
}
```

The plugin created an item within `fields` named with the camel case version of the dot notation path to the processed field, with `Katex` appended.

## How to contribute

Please submit pull requests to the GitHub repository.

## Tips

* Dollar signs `$` can be escaped with a `\` in order to be ignored by Katex. If you wish to have a `$` literally appear in your text, write it as `\$`.
* Pay attention to the objects/arrays in the configuration. `process` expects an array of objects. Each object has a `type` and `fields` key. `fields` expects an array of dot notation paths to the fields of interest.
* There is no need to include `internal { type }` in your graphQL queries. That was shown above just to illustrate the value needed for the `type` key in the configuration.

## Known limitations

* "display mode" isn't supported. Math is always rendered in "inline" mode.
* Other delimiters are not supported. Only `$` signs will work.

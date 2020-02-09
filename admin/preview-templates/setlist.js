import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

// Preview component for a Page
const SetList = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <h1>${entry.getIn(["data", "title"], null)}</h1>

        ${this.props.widgetFor("body")}
      </main>
    `;
  }
});

export default SetList;

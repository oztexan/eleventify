import Post from "/admin/preview-templates/post.js";
import Page from "/admin/preview-templates/page.js";
import Song from "/admin/preview-templates/song.js";
import SetList from "/admin/preview-templates/setlist.js";

// Register the Post component as the preview for entries in the blog collection
CMS.registerPreviewTemplate("blog", Post);
CMS.registerPreviewTemplate("pages", Page);
CMS.registerPreviewTemplate("songs", Song);
CMS.registerPreviewTemplate("setlists", SetList);

CMS.registerPreviewStyle("/_includes/assets/css/inline.css");
// Register any CSS file on the home page as a preview style
fetch("/")
  .then(response => response.text())
  .then(html => {
    const f = document.createElement("html");
    f.innerHTML = html;
    Array.from(f.getElementsByTagName("link")).forEach(tag => {
      if (tag.rel == "stylesheet" && !tag.media) {
        CMS.registerPreviewStyle(tag.href);
      }
    });
  });

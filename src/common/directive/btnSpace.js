export default {
  name: "btnSpace",
  option: {
    inserted: function(el) {
      if (el.innerText.length === 2 && !el.innerHTML.includes("&nbsp;")) {
        let temp = el.innerText.split("").join("&nbsp;&nbsp;");
        el.innerHTML = `<span>${temp}</span>`;
      }
    }
  }
};

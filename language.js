function translate() {
  const word = document.getElementById("wordInput").value.toLowerCase();
  const lang = document.getElementById("langSelect").value;

  const data = {
    hello: { spanish: "hola", german: "hallo", japanese: "こんにちは" },
    bye: { spanish: "adios", german: "tschüss", japanese: "さようなら" }
  };

  document.getElementById("output").innerText =
    data[word]?.[lang] || "Translation not found";
}
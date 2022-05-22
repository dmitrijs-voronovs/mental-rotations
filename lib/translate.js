const writeFileSync = require("fs").writeFileSync;
const fetch = require("node-fetch");

const translate = (word) =>
  fetch(
    `https://hugo.lv/ws/Service.svc/json/GetDictionaryEntry?word=${word}&sourceLanguage=lv&targetLanguage=ru`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "client-id": "u-9ab0841f-1bbf-4cc4-9323-bd5bbddb4f3a",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: "https://hugo.lv/en",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((r) => {
      console.log(r);
      return r;
    })
    .then((r) => r.body.getReader().read())
    .then((d) => new TextDecoder().decode(d.value))
    .then((d) => [word, JSON.parse(d)[0].translations[0].target_word])
    .then((r) => {
      console.log(r);
      return r;
    })
    .catch((e) => {
      console.log(e);
      return ["", ""];
    });

const all = {
  Interese: "Интерес",
  Lepnums: "Гордость",
  Prieks: "Радость",
  Atvieglojums: "Облегчение",
  Līdzjutība: "Сочувствие",
  Vaina: "Сожаление",
  Uzjautrinājums: "веселие",
  Bauda: "удовольствие",
  Apmierinājums: "удовлетворение",
  Apbrīna: "восхищение",
  Mīlestība: "любовь",
  Skumjas: "печаль",
  Vaina: "вина",
  Nožela: "Разочарование",
  Kauns: "стыд",
  Vilšanās: "разочарование",
  Bailes: "страх",
  Riebums: "отвращение",
  Nicinājums: "презрение",
  Naids: "ненависть",
  Dusmas: "гнев",
  "PSVT:R digital test": "",
  "Object Rotation": "",
};

Promise.all(Object.keys(all).map((w) => translate(w)))
  .then((r) => ({ ...all, ...Object.fromEntries(r.filter((a) => !!a[0])) }))
  .then((w) =>
    writeFileSync("./translations.json", JSON.stringify(w), {
      encoding: "utf-8",
    })
  );

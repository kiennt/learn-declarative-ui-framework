import { compile } from "../lib";
import prettier from "prettier";
import { describe, it } from "vitest";

describe.skip("e2e", () => {
  const testCases: Array<string> = [
    // "https://raw.githubusercontent.com/tikivn/tiniapp-miki/main/src/pages/index/index.txml?token=GHSAT0AAAAAABU5XQTYMRVW4D4LVMC5RMWIYYIVXCA",
    "https://raw.githubusercontent.com/tikivn/tiniapp-miki/main/src/pages/account/index.txml?token=GHSAT0AAAAAABU5XQTYEWLFXBN57F7HBLQ6YYIXD3A"
  ];
  testCases.forEach(_url => {
    it("miki", async () => {
      // const resp = await axios.get(url);
      // const data = resp.data
      const data = `
      <import-sjs from="../../utils/sjs.sjs" name="a, b, c"></import-sjs>

       
      `;
      const code = compile(data);
      console.log(prettier.format(code));
    });
  });
});

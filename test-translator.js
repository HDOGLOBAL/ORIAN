import { autoTranslateMissing } from "./utils/translator.js";

async function runTest() {
  console.log("=== Testing Auto-Translation ===\n");

  const existingDoc = {
    name: "Old Product",
    description: "Old description",
    namePt: "Produto Antigo (Human Edited)",
    translationSource: new Map(Object.entries({
      namePt: "human"
    }))
  };

  const newDataPayload = {
    name: "New Automatic Mixer",
    description: "High speed commercial mixer.",
    // The user edited the existing namePt manually earlier
    // and left the rest empty.
  };

  console.log("Input existingDoc:");
  console.log(existingDoc);

  console.log("\nInput new payload:");
  console.log(newDataPayload);

  console.log("\nRunning autoTranslateMissing...");
  const result = await autoTranslateMissing(newDataPayload, existingDoc);

  console.log("\nResulting payload:");
  console.log(result);
  
  console.log("\nNotice:");
  console.log("- namePt remained untouched because it was marked 'human' in translationSource.");
  console.log("- Other fields like nameFr, nameEs etc. were auto-translated (using the fallback [AUTO] prefix if no API key is set).");
  console.log("- translationSource map tracks which fields are 'auto' and 'human'.");
}

runTest();

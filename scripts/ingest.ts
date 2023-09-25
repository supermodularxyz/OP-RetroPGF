import { writeFileSync } from "fs";
import {
  fetchLists,
  fetchProfiles,
  fetchProjects,
} from "../src/utils/attestations";

(() => {
  void Promise.all([fetchProfiles(), fetchProjects(), fetchLists()]).then(
    ([profiles, projects, lists]) => {
      console.log(JSON.stringify({ profiles, projects, lists }, null, 2));

      saveFile("profiles", profiles);
      saveFile("projects", projects);
      saveFile("lists", lists);
    }
  );
})();

function saveFile(name: string, data: object) {
  writeFileSync(`./src/data/${name}.json`, JSON.stringify(data), "utf-8");
}

// Would this make it easier/more efficient to query from the frontend?
function toModel(collection: { id: string }[]) {
  return collection.reduce<{ allIds: string[]; byId: Record<string, unknown> }>(
    (acc, x) => {
      return {
        ...acc,
        byId: { ...acc.byId, [x.id]: x },
        allIds: acc.allIds.concat(x.id),
      };
    },
    { byId: {}, allIds: [] }
  );
}

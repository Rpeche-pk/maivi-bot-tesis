import {addKeyword} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../../utils/idle.util.js";
import {generateCategoryButtons, getValues} from "../../../utils/btn.util.js";

const REGEX_INPUT_CATEGORY = '/Buscar por categoría/g';

const search_categories_flow = addKeyword(REGEX_INPUT_CATEGORY, {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState, flowDynamic}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    }).addAnswer("🔍 *Elige una categoría a consultar:* 📦",
        {
            capture:true,
            buttons: generateCategoryButtons(),
        }, async (ctx, {gotoFlow,globalState}) => {
            idleReset(ctx, gotoFlow, globalState.get("timer"));
            const body = ctx?.body.replace("*", "").replace("*", "");
            console.log(body);
            console.log(getValues(body));
        });

export {search_categories_flow};

import {addKeyword} from "@builderbot/bot";
import {idleReset, idleStart, idleStop} from "../../../utils/idle.util.js";
import {generateCategoryButtons, getValues} from "../../../utils/btn.util.js";
import {getBrandCategory, getProductsByBrand} from "../../../service/api.service.js";
import {setRandomDelay} from "../../../utils/delay.util.js";

const REGEX_INPUT_CATEGORY = '/Buscar por categoría/g';

const search_categories_flow = addKeyword("/#test/g", {regex: true})
    .addAction(async (ctx, {gotoFlow, globalState,extensions}) => {
        idleStop(ctx);
        idleStart(ctx, gotoFlow, globalState.get("timer"));
    }).addAnswer("🔍 *Elige una categoría a consultar:* 📦",
        {
            capture: true,
            buttons: generateCategoryButtons(),
            delay: setRandomDelay(590, 500)
        }, async (ctx, {gotoFlow, globalState, extensions, state, provider}) => {
            idleReset(ctx, gotoFlow, globalState.get("timer"));
            const body = ctx?.body.replace("*", "").replace("*", "").trim();
            const phone = ctx?.from;
            const number = ctx?.key?.remoteJid;
            //myState[ctx.from] = {...myState[ctx.from], body};
            const categories = getValues(body);
            await state.update({body: {category: categories}});

            const brandByCategories = await getBrandCategory(extensions, categories)

            await provider.vendor.sendMessage(
                number, {
                    poll:
                        {
                            "name": "👉🏽 *Elige una marca a consultar:* 😊",
                            "values": brandByCategories,
                            "selectableCount": 1,
                        }
                }
            );

        })
    .addAction({capture: true}, async (ctx, {extensions,gotoFlow, state}) => {

        const brand = ctx?.body;
        const categories = state.get("body")?.category;

        console.log("MARCA DEL PRODUCTO", ctx.body);
        console.log("CATEGORIA DEL PRODUCTO", categories);

        await getProductsByBrand(extensions,brand, categories);

    });

export {search_categories_flow};

import { initPremiumTooltips } from "./ui/premium-tooltip.js";
import { EventBus } from "./events/event-bus.js";
import { PlayerFlowController } from "./flows/player-flow-controller.js";

document.addEventListener('DOMContentLoaded', async () => {

    EventBus.on("playlist:updated", async () => {
        await PlayerFlowController.updatePlaylists();
    });
    
    initPremiumTooltips();
    PlayerFlowController.init();
});
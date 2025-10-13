export class MusicPlayerService {
    
    private ajaxUrl: string;

    constructor(ajaxUrl: string) {
        this.ajaxUrl = ajaxUrl;
    }

    /**
     * Faz uma requisição AJAX ao backend do WordPress para renderizar o player.
     * @param playlist ID ou slug da playlist.
     * @param title Título a ser exibido no player.
     * @returns Promise<string> contendo o HTML renderizado.
     */
    async fetchPlayerHTML(playlist: string, title: string): Promise<string> {
        try {
            const response = await fetch(this.ajaxUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    action: "render_music_player",
                    playlist,
                    title,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success || !data.data?.html) {
                throw new Error("Resposta inválida ao renderizar o player.");
            }

            return data.data.html as string;
        } catch (error) {
            console.error("Erro ao buscar o player:", error);
            throw error;
        }
    }
}

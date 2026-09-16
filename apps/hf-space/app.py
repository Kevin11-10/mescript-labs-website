import gradio as gr
import json

def generate_draft(prompt, context):
    prompt_text = prompt.strip() if prompt else 'Create a marketing update for Mescript Labs.'
    context_text = context.strip() if context else 'creative product marketplace'

    title = f"AI Draft: {' '.join(prompt_text.split()[:6]) or 'Mescript Update'}"
    summary = f"A short summary focusing on {context_text}."
    body = (
        f"{title}\n\n"
        f"{summary}\n\n"
        f"Generated content:\n"
        f"Mescript Labs is building a premium creative marketplace for 3D assets. {prompt_text} "
        f"This draft emphasizes quality, licensing clarity, and creator-first experiences."
    )
    suggestions = [
        'Emphasize creator trust and licensing details.',
        'Include clear calls to action and purchase benefits.',
        'Add technical specs and preview thumbnails for 3D assets.'
    ]

    result = {
        'title': title,
        'summary': summary,
        'body': body,
        'suggestions': suggestions
    }

    # Return JSON string for easy preview in the Space UI
    return json.dumps(result, indent=2)

with gr.Blocks() as demo:
    gr.Markdown('# Mescript Labs — AI Draft Prototype')
    gr.Markdown('This lightweight prototype returns structured JSON drafts for testing the backend fallback flow.')
    with gr.Row():
        prompt = gr.Textbox(label='Prompt', placeholder='Write a marketing draft for the new 3D collection...')
        context = gr.Textbox(label='Context', placeholder='Context for the draft (optional)')
    generate_btn = gr.Button('Generate Draft')
    output = gr.Textbox(label='Draft (JSON)')

    generate_btn.click(generate_draft, inputs=[prompt, context], outputs=[output])

if __name__ == '__main__':
    # On Hugging Face Spaces, ensure no share link is created and do not open a browser.
    demo.launch(server_name='0.0.0.0', server_port=7860, share=False, inbrowser=False, prevent_thread_lock=True)

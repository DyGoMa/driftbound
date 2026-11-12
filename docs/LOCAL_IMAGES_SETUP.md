# Local pictures: install notes for Dylan (v1, 2026-11-12)

Dylan asked (2026-11-12): "Any way for me to locally generate the images instead of chat gpt", then "Go fully local". Claude installed the official parts; the two character tools below are community-made code, which Claude may not download or run itself, so Dylan installs them and Claude drives them afterwards. Results so far are logged in `docs/DECISIONS.md` ("Your words (2026-11-12, local pictures)").

## What is already installed (by Claude, official sources)
| Part | Where | Source |
|---|---|---|
| ComfyUI (commit c5751c8) | `C:\Users\Dylan\Documents\local-imagegen\ComfyUI` | github.com/comfyanonymous/ComfyUI |
| AMD engine: PyTorch 2.13.0+rocm10.0.0 for the RX 6800 (gfx1030) | `...\local-imagegen\venv313` (5.1 GB) | stable.repo.amd.com (AMD) |
| Old DirectML engine (unused; current ComfyUI dropped DirectML) | `...\local-imagegen\venv` | pip (Microsoft); kept on Dylan's word |
| Anime model NoobAI-XL v1.1 (personal use only, no selling) | `ComfyUI\models\checkpoints` (7.1 GB) | huggingface.co/Laxhar/noobai-XL-1.1 |
| Layout guide (ControlNet union promax, Apache-2.0) | `ComfyUI\models\controlnet` (2.5 GB) | huggingface.co/xinsir/controlnet-union-sdxl-1.0 |

Start ComfyUI (Claude does this through the app's preview; by hand it is):
```
C:\Users\Dylan\Documents\local-imagegen\venv313\Scripts\python.exe C:\Users\Dylan\Documents\local-imagegen\ComfyUI\main.py --listen 127.0.0.1 --port 8188
```
Then open http://127.0.0.1:8188 in a browser.

## Tool 1: IP-Adapter ("copy this character from a picture")
Community code: `cubiq/ComfyUI_IPAdapter_plus` on GitHub (about 6,200 stars; last code change 2025-04-14, so it is in maintenance, not active development).

**You do (about 5 minutes):**
1. Stop ComfyUI if it is running.
2. Open a terminal in `C:\Users\Dylan\Documents\local-imagegen\ComfyUI\custom_nodes`.
3. Run: `git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git`
4. Tell Claude "IP-Adapter installed".

**Claude then does (model files only, no code; Apache-2.0, from huggingface.co/h94/IP-Adapter, on your yes):**
- `models/image_encoder/model.safetensors` (2.53 GB) → `ComfyUI\models\clip_vision\CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors`
- `sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors` (0.85 GB) → `ComfyUI\models\ipadapter\`
- Restart ComfyUI and test one Kaito panel with his locked sheet attached (plan step 4).

## Tool 2: a LoRA trainer (a per-character add-on, made from the locked pictures)
Community code: `Nerogar/OneTrainer` on GitHub (about 3,300 stars; updated 2026-11-09).

**Not verified on your card.** Claude found no tested recipe for OneTrainer on Windows with an AMD RX 6800. One OneTrainer issue says its AMD requirements file needed hand fixes on Windows. Two ways:
- **A. Try it locally (free, may not work):**
  1. Open a terminal in `C:\Users\Dylan\Documents\local-imagegen`.
  2. Run: `git clone https://github.com/Nerogar/OneTrainer.git`
  3. Tell Claude "OneTrainer cloned". Claude reads its install files first, then suggests putting AMD's same engine (the one in `venv313`) under it in place of its default (Nvidia) one, and asks before running anything.
- **B. Rent a cloud graphics card** (about $1-3 per character, Claude's estimate): Claude prices it and asks for your yes on each character (your answer: "Price it, ask each time").

## What to try after each install
- After Tool 1: Claude makes one Kaito panel locally with his sheet attached; you judge whether he is recognisable (plan step 4).
- After Tool 2: Claude trains Kaito's add-on from his locked pictures and makes the same panel again; you compare.

Sources: [IP-Adapter node](https://github.com/cubiq/ComfyUI_IPAdapter_plus), [IP-Adapter models](https://huggingface.co/h94/IP-Adapter), [OneTrainer AMD issue](https://github.com/Nerogar/OneTrainer/issues/1381), [ComfyUI official AMD ROCm on Windows](https://blog.comfy.org/p/official-amd-rocm-support-arrives).

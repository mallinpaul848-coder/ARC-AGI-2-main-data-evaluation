# APEX Local Training Path

Data -> tokenizer -> initialization -> training -> validation -> checkpoint -> APEXMODEL1 -> APEX inference runtime.

Training and inference can run entirely on APEX-owned hardware. The runtime has no network dependency and does not require Hugging Face, OpenAI, Vercel, or another inference provider.

The remaining substantive model asset is a larger trained checkpoint.

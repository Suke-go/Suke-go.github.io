/**
 * i18n.js — Bilingual JA/EN string management
 */
const STRINGS = {
  // Language selector
  lang_select_title: { en: "Select Language / 言語を選択", ja: "言語を選択 / Select Language" },
  lang_en: { en: "English", ja: "English" },
  lang_ja: { en: "日本語", ja: "日本語" },

  // Participant ID
  pid_preamble: { en: "The experimenter should enter the participant number. This determines condition assignment.", ja: "実験者が参加者番号を入力してください。条件の割り当てに使用されます。" },
  pid_loading: { en: "Preparing your session…", ja: "セッションを準備しています…" },
  pid_contact_intro: { en: "Please enter your name and an email address for sending the gift card reward. They are used only for sending the reward and are stored separately from your responses.", ja: "謝礼（Amazonギフトカード）送付のため、お名前とメールアドレスを入力してください。謝礼の送付以外には使用せず、回答データとは分けて管理します。" },
  pid_name_prompt: { en: "Name", ja: "お名前" },
  pid_name_placeholder: { en: "e.g. Taro Tsukuba", ja: "例: 筑波 太郎" },
  pid_email_prompt: { en: "Email address (for the gift card)", ja: "メールアドレス（ギフトカード送付用）" },
  pid_score_placeholder: { en: "e.g. TOEIC 785 / IELTS 6.5", ja: "例: TOEIC 785 / 英検準1級 / IELTS 6.5" },

  // Consent
  consent_title: { en: "Informed Consent", ja: "研究参加同意書" },
  consent_body: {
    en: `<h2>Informed Consent for Research Participation</h2>
<table class="consent-table">
<tr><td><strong>Study title</strong></td><td>Evaluation of Prosody-Driven Subtitles for Video Content</td></tr>
<tr><td><strong>Institution</strong></td><td>University of Tsukuba</td></tr>
<tr><td><strong>Principal investigator</strong></td><td>[Name]</td></tr>
</table>
<h3>1. Purpose</h3>
<p>This study investigates how different subtitle presentation styles affect comprehension and perception of speaker intent in video content.</p>
<h3>2. Procedure</h3>
<p>If you agree to participate, you will be asked to:</p>
<ol>
  <li>Complete a brief questionnaire on your language background and English proficiency (approx. 3 min)</li>
  <li>Watch 6 short video clips (each approx. 90 seconds) with subtitles and answer questions about each clip (approx. 35 min)</li>
  <li>Complete a brief post-experiment questionnaire (approx. 2 min)</li>
</ol>
<h3>3. Duration</h3>
<p>Total estimated time: approximately 45 minutes.</p>
<h3>4. Risks and benefits</h3>
<p>There are no known risks associated with participation. The study does not involve deception. No direct benefits are guaranteed, but your participation contributes to research on accessible subtitle technology.</p>
<h3>5. Data handling</h3>
<p>All responses are recorded anonymously. No personally identifiable information is collected beyond a participant code. Data will be used solely for academic research purposes and stored on secured servers. Results may be published in academic venues in aggregate form only.</p>
<h3>6. Voluntary participation</h3>
<p>Participation is entirely voluntary. You may withdraw at any time by closing the browser window, without penalty or loss of benefits. Partial data from withdrawn participants will be discarded.</p>
<h3>7. Contact</h3>
<p>For questions about this study, please contact: [shimizu@ai.iit.tsukuba.ac.jp]</p>`,
    ja: `<h2>研究参加に関する説明・同意書</h2>
<table class="consent-table">
<tr><td><strong>研究課題名</strong></td><td>韻律駆動型字幕の有効性評価</td></tr>
<tr><td><strong>研究実施機関</strong></td><td>筑波大学</td></tr>
<tr><td><strong>研究責任者</strong></td><td>善甫啓一</td></tr>
<tr><td><strong>研究実施者</strong></td><td>清水紘輔</td></tr>
</table>
<h3>1. 研究の目的</h3>
<p>本研究は、映像コンテンツにおける字幕提示方法の違いが、内容理解および話者意図の知覚に与える影響を調査するものです。</p>
<h3>2. 実験の手続き</h3>
<p>参加に同意いただける場合、以下の課題を行っていただきます。</p>
<ol>
  <li>言語背景・英語熟達度に関する簡単な質問紙への回答（約3分）</li>
  <li>字幕付きの短い映像クリップ6本（各約90秒）の視聴と、各クリップに関する質問への回答（約35分）</li>
  <li>事後アンケートへの回答（約2分）</li>
</ol>
<h3>3. 所要時間</h3>
<p>全体で約45分を予定しています。</p>
<h3>4. リスクと利益</h3>
<p>本研究への参加に伴う既知のリスクはありません。本研究に欺瞞的手法は含まれていません。直接的な利益は保証されませんが、アクセシブルな字幕技術の研究に貢献していただけます。</p>
<h3>5. データの取り扱い</h3>
<p>回答はすべて匿名で記録されます。参加者コード以外の個人識別情報は収集しません。データは学術研究目的にのみ使用され、セキュリティが確保されたサーバーに保管されます。研究成果は集計した形でのみ学術論文等で公表される場合があります。</p>
<h3>6. 参加の任意性</h3>
<p>参加は完全に任意です。ブラウザを閉じることにより、いつでも不利益なく参加を中断できます。中断された場合、それまでの回答データは破棄されます。</p>
<h3>7. 問い合わせ先</h3>
<p>本研究に関する質問は以下までご連絡ください: [メールアドレス]</p>`
  },
  consent_agree: { en: "I agree to participate", ja: "上記の説明を理解し、研究への参加に同意します" },
  consent_checkbox: { en: "I have read and understood the above information, and I voluntarily agree to participate in this study.", ja: "上記の説明事項を読み、内容を理解した上で、本研究に参加することに同意します。" },

  // Pledge download + signed scan upload
  cupload_title: { en: "Pledge Submission", ja: "誓約書の提出" },
  cupload_body: { en: "Please download the pledge below, sign it, and upload a scan or photo of the signed document.", ja: "以下から誓約書をダウンロードして署名し、署名済みの書類のスキャンまたは写真をアップロードしてください。" },
  cupload_dl_consent: { en: "Download pledge (PDF)", ja: "誓約書をダウンロード（PDF）" },
  cupload_upload_prompt: { en: "Upload the signed pledge (image or PDF, max 10 MB):", ja: "署名済み誓約書をアップロードしてください（画像またはPDF、最大10MB）：" },
  cupload_selected: { en: "Selected: {name}", ja: "選択済み: {name}" },
  cupload_too_large: { en: "File is too large (max 10 MB). Please choose a smaller file.", ja: "ファイルが大きすぎます（最大10MB）。小さいファイルを選んでください。" },
  cupload_submit: { en: "Upload and continue", ja: "アップロードして次へ" },
  cupload_later: { en: "Upload later (submit to the experimenter afterwards)", ja: "後でアップロードする（実験後に実験者へ提出）" },
  pid_auto_assigned: { en: "Your participant number has been assigned automatically: #{n}", ja: "参加者番号は自動で割り当てられました：#{n}" },

  // Demographics
  demo_title: { en: "Participant Information", ja: "基本情報" },
  demo_age: { en: "Age", ja: "年齢" },
  demo_age_opts: { en: ["18–24", "25–34", "35–44", "45–54", "55 or older"], ja: ["18〜24歳", "25〜34歳", "35〜44歳", "45〜54歳", "55歳以上"] },
  demo_gender: { en: "Gender", ja: "性別" },
  demo_gender_opts: { en: ["Male", "Female", "Non-binary / other", "Prefer not to answer"], ja: ["男性", "女性", "その他", "回答しない"] },
  demo_l1: { en: "First language (native language)", ja: "第一言語（母語）" },
  demo_l1_opts: { en: ["Japanese", "Chinese", "Korean", "Vietnamese", "Indonesian", "Thai", "Other"], ja: ["日本語", "中国語", "韓国語", "ベトナム語", "インドネシア語", "タイ語", "その他"] },
  demo_subtitle_freq: { en: "How often do you use subtitles when watching video content?", ja: "映像コンテンツを視聴する際、字幕をどの程度利用しますか？" },
  demo_subtitle_opts: { en: ["Never", "Rarely", "Sometimes", "Often", "Always"], ja: ["全く利用しない", "ほとんど利用しない", "時々利用する", "よく利用する", "常に利用する"] },

  // English Proficiency Self-Report
  cefr_title: { en: "English Proficiency", ja: "英語熟達度" },
  cefr_instr: {
    en: "Please indicate your overall English proficiency level. Select the option that best describes your current ability.",
    ja: "現在の英語力に最も近い水準を選択してください。"
  },
  cefr_overall: { en: "Overall English proficiency level", ja: "英語の総合的な熟達度" },
  cefr_overall_opts: {
    en: [
      "A1 — Beginner (can understand basic phrases)",
      "A2 — Elementary (can handle simple communication)",
      "B1 — Intermediate (can understand main points of clear speech)",
      "B2 — Upper-Intermediate (can understand complex texts and discussions)",
      "C1 — Advanced (can understand demanding, extended texts)",
      "C2 — Proficient (near-native comprehension)",
      "Native speaker"
    ],
    ja: [
      "A1 — 初級（英検3級相当 / TOEIC ~300）",
      "A2 — 初中級（英検準2級相当 / TOEIC 300-400）",
      "B1 — 中級（英検2級相当 / TOEIC 400-600 / TOEFL 42-71）",
      "B2 — 中上級（英検準1級相当 / TOEIC 600-800 / TOEFL 72-94 / IELTS 5.5-6.5）",
      "C1 — 上級（英検1級相当 / TOEIC 800+ / TOEFL 95-120 / IELTS 7.0+）",
      "C2 — 最上級（ネイティブに近い運用力）",
      "母語話者"
    ]
  },
  cefr_listening: { en: "Listening comprehension ability", ja: "英語リスニングの熟達度" },
  cefr_listening_opts: {
    en: [
      "A1–A2 — I can understand slow, clear speech on familiar topics",
      "B1 — I can understand the main points of clear standard speech",
      "B2 — I can understand most TV shows and films in standard dialect",
      "C1 — I can understand extended speech even when not clearly structured",
      "C2 — I have no difficulty understanding any spoken English",
      "Native speaker"
    ],
    ja: [
      "A1–A2 — ゆっくりはっきりした身近な話題の会話なら理解できる",
      "B1 — 明瞭で標準的な話し方であれば要点を理解できる",
      "B2 — ニュースやドラマなど、標準的な発話の大部分を理解できる",
      "C1 — 構造が不明瞭でも長い発話を理解できる",
      "C2 — あらゆる英語の音声を容易に理解できる",
      "母語話者"
    ]
  },
  cefr_test_score: { en: "English test score, if applicable (optional)", ja: "英語資格・テストのスコア（お持ちの方のみ・任意回答）" },
  cefr_test_type_opts: {
    en: ["None", "Eiken (英検)", "TOEIC", "TOEFL iBT", "IELTS", "Cambridge (FCE/CAE/CPE)", "Other"],
    ja: ["なし", "英検", "TOEIC", "TOEFL iBT", "IELTS", "Cambridge (FCE/CAE/CPE)", "その他"]
  },

  // Emphasis word-click task
  emph_click_title: { en: "Which words were emphasized?", ja: "強調されていた語はどれですか？" },
  emph_click_instr: { en: "In the sentence below, click the word(s) you felt the speaker emphasized (1 to 3 words). Click again to deselect.", ja: "以下の文の中で、話者が強調していたと感じた語をクリックしてください（1〜3語）。もう一度クリックすると選択を解除できます。" },
  emph_click_count: { en: "{n} / 3 selected", ja: "選択中: {n} / 3" },

  // Practice
  practice_title: { en: "Practice Trial", ja: "練習試行" },
  practice_instr: { en: "This is a practice trial. Watch the video with subtitles, then answer the questions that follow.", ja: "これは練習試行です。字幕付きの映像を視聴し、その後の質問に回答してください。" },

  // Main trials
  trial_counter: { en: "Clip {n} of 6", ja: "クリップ {n} / 6" },
  trial_video_instr: { en: "Watch the video carefully. You cannot pause or rewind.", ja: "映像をよく見てください。一時停止・巻き戻しはできません。" },
  trial_quiz_title: { en: "Comprehension Questions", ja: "理解度クイズ" },
  trial_intent_title: { en: "Speaker Intent Questions", ja: "話者意図の質問" },
  trial_rating_title: { en: "Your Impressions", ja: "主観評価" },
  btn_next: { en: "Next", ja: "次へ" },
  btn_start_video: { en: "Start Video", ja: "映像を開始" },
  btn_proceed: { en: "Proceed to Questions", ja: "質問に進む" },
  btn_start_main: { en: "Start", ja: "開始" },
  main_trials_ready: { en: "Ready? Press Start to begin the main experiment.", ja: "準備ができたら「開始」を押して本試行を開始してください。" },
  main_trials_heading: { en: "Main Trials", ja: "本試行" },

  // Rest break between clips
  rest_break_title: { en: "Short Break", ja: "休憩" },
  rest_break_body: { en: "Please take a short rest. The next clip will begin automatically.", ja: "少し休憩してください。次のクリップは自動的に始まります。" },
  rest_break_remaining: { en: "Remaining: {s}s", ja: "残り: {s}秒" },
  rest_break_skip: { en: "Skip", ja: "スキップ" },

  // Subjective ratings
  rating_understanding: { en: "How well did you understand the content?", ja: "内容をどの程度理解できましたか？" },
  rating_readability: { en: "How readable was the subtitle?", ja: "字幕はどの程度読みやすかったですか？" },
  rating_engagement: { en: "How engaged were you?", ja: "どの程度集中できましたか？" },
  rating_prosody: { en: "Did the subtitle help you notice the speaker's emphasis?", ja: "字幕は話者の強調に気づく助けになりましたか？" },
  rating_low: { en: "Not at all", ja: "全くそう思わない" },
  rating_high: { en: "Very much", ja: "非常にそう思う" },

  // NASA-TLX
  nasa_title: { en: "Workload Assessment", ja: "作業負荷の評価" },
  nasa_preamble: { en: "Please rate your experience for the video you just watched. There are no right or wrong answers — just answer based on how you felt.", ja: "今視聴した映像についての印象を評価してください。正解・不正解はありません。感じたままにお答えください。" },
  nasa_mental: { en: "Mental Demand — How mentally demanding was the task?", ja: "精神的要求 — 精神的にどの程度大変でしたか？" },
  nasa_physical: { en: "Physical Demand — How physically demanding was the task?", ja: "身体的要求 — 身体的にどの程度大変でしたか？" },
  nasa_temporal: { en: "Temporal Demand — How hurried or rushed was the pace?", ja: "時間的圧迫 — どの程度急かされましたか？" },
  nasa_performance: { en: "Performance — How successful were you in accomplishing what you were asked to do?", ja: "パフォーマンス — 求められたことをどの程度うまく達成できましたか？" },
  nasa_effort: { en: "Effort — How hard did you have to work to accomplish your level of performance?", ja: "努力 — パフォーマンスを達成するためにどの程度努力しましたか？" },
  nasa_frustration: { en: "Frustration — How insecure, discouraged, irritated, stressed, and annoyed were you?", ja: "不満 — どの程度イライラ・ストレス・不安を感じましたか？" },
  nasa_low: { en: "Low", ja: "低い" },
  nasa_high: { en: "High", ja: "高い" },
  nasa_perf_low: { en: "Perfect", ja: "完璧" },
  nasa_perf_high: { en: "Failure", ja: "失敗" },

  // Post-survey
  post_title: { en: "Post-Experiment Survey", ja: "事後アンケート" },
  post_notice_diff: { en: "Did you notice any differences between the subtitle styles?", ja: "字幕スタイルの違いに気づきましたか？" },
  post_notice_opts: { en: ["Yes", "No"], ja: ["はい", "いいえ"] },
  post_describe: { en: "If you noticed differences between subtitle styles, please describe them below.", ja: "字幕スタイルの違いに気づいた場合、その内容を記述してください。" },
  post_preference: { en: "Which subtitle style did you prefer the most?", ja: "どの字幕スタイルが最も好ましかったですか？" },
  post_pref_opts: { en: ["All words same size", "Some words smaller/larger (grammar-based)", "Some words smaller/larger (emphasis-based)", "Combination of grammar and emphasis"], ja: ["全単語が同じサイズ", "文法に基づいて大小がある", "強調に基づいて大小がある", "文法と強調の組み合わせ"] },
  post_impressions: { en: "Please share any impressions or comments about the experiment.", ja: "実験の感想やコメントがあればお書きください。" },

  // Per-clip prior exposure (asked at the start of each clip's quiz)
  clip_prior_exposure: { en: "Had you seen this video before today?", ja: "この動画を今日以前に見たことがありましたか？" },
  clip_prior_opts: { en: ["No, this was my first time seeing it", "Yes, but I didn't remember the content", "Yes, and I remembered the content"], ja: ["いいえ、初めて見ました", "はい、見たことがありますが内容は覚えていませんでした", "はい、見たことがあり内容も覚えていました"] },

  // Completion & Gift card
  complete_title: { en: "Thank you!", ja: "ご協力ありがとうございました！" },
  complete_body: { en: "Your responses have been recorded. You may now close this page.", ja: "回答が記録されました。このページを閉じていただいて結構です。" },
  complete_download: { en: "Download Data (JSON)", ja: "データをダウンロード（JSON）" },
  reward_title: { en: "Gift Card Reward", ja: "謝礼の送付" },
  reward_body: { en: "Please enter your email address below to receive your Amazon gift card reward (1,000 yen). Your email will only be used for sending the gift card.", ja: "謝礼のAmazonギフトカード（1,000円）をお送りします。以下にメールアドレスを入力してください。メールアドレスはギフトカード送付のみに使用します。" },
  reward_email_prompt: { en: "Email address", ja: "メールアドレス" },
  reward_skip: { en: "Skip (no reward)", ja: "スキップ（謝礼不要）" },
  reward_submit: { en: "Submit", ja: "送信" },

  // Dummy test
  dummy_instruction: { en: "Please select option {n} to confirm you are paying attention.", ja: "注意確認: 選択肢{n}を選んでください。" },

  // Progress
  progress_of: { en: "of", ja: "/" },
};

let _lang = 'ja';

export function setLang(lang) { _lang = lang; }
export function getLang() { return _lang; }

export function t(key, replacements = {}) {
  const entry = STRINGS[key];
  if (!entry) return key;
  let text = entry[_lang] ?? entry['en'] ?? key;
  for (const [k, v] of Object.entries(replacements)) {
    text = typeof text === 'string' ? text.replace(`{${k}}`, v) : text;
  }
  return text;
}

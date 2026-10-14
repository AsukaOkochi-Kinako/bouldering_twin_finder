// クライマーデータ（2026年10月時点で調査）
// height: 身長(cm)。協会・IFSC・五輪公式などの公表値を優先。
// span:   腕の長さ＝両腕を広げた指先から指先まで(cm)。
//         公式な計測値はほぼ公開されていないため、Wikipedia の ape index や
//         クライミング専門メディアの参考値から「身長＋ape index」で算出。
//         信頼できる値が見つからない選手は null（画面では「不明」）。
// 出典はそれぞれの行のコメントに記載。
// null の選手は 2026-10 時点で日英独の報道・公式プロフィール・計測イベント資料を
// 探しても数値が見つからなかったもの。
// gender: "m" | "f"
// video: YouTube 検索ワード（動画IDの直リンクはリンク切れしやすいので検索で開く）
const CLIMBERS = [
  // ---------- 男子 ----------
  {
    // 身長: JMSCA選手プロフィール / ape +10: Wikipedia, 99Boulders, Climbing House
    name: "楢崎 智亜", en: "Tomoa Narasaki", country: "JPN", gender: "m",
    height: 169, span: 179,
    tags: ["ダイナミック", "スピード"],
    feature: "体操で鍛えた身体能力を武器に、ランジやコーディネーションを軽々こなす。“智亜ジャンプ”の名を持つ跳躍系ムーブが代名詞。",
    video: "Tomoa Narasaki bouldering"
  },
  {
    // 身長: J SPORTS / Wikipedia / ape +13: Wikipedia
    name: "安楽 宙斗", en: "Sorato Anraku", country: "JPN", gender: "m",
    height: 168, span: 181,
    tags: ["リーチ", "持久力"],
    feature: "ボルダーもリードも高水準でこなすオールラウンダー。身長より10cm以上長い腕を生かした遠いムーブと、最後まで落ちない保持力。",
    video: "Sorato Anraku bouldering"
  },
  {
    // 身長: JMSCA選手プロフィール / 腕の長さ: 情報なし
    name: "緒方 良行", en: "Yoshiyuki Ogata", country: "JPN", gender: "m",
    height: 172, span: null,
    tags: ["パワー", "コンペ"],
    feature: "ボルダリング・ジャパンカップ優勝経験を持つ実力派。強傾斜でのパワフルな保持と、思い切りのよい動き。",
    video: "Yoshiyuki Ogata bouldering"
  },
  {
    // 身長: JMSCA選手プロフィール / 腕の長さ: 情報なし
    name: "藤井 快", en: "Kokoro Fujii", country: "JPN", gender: "m",
    height: 175, span: null,
    tags: ["パワー", "安定感"],
    feature: "長く日本代表を牽引してきたボルダラー。ブレの少ない身体の使い方と、確実にホールドを止める力強さ。",
    video: "Kokoro Fujii bouldering"
  },
  {
    // 身長: Wikipedia, climbing-history.org / ape +1: Wikipedia, 99Boulders, Climbing House
    name: "アダム・オンドラ", en: "Adam Ondra", country: "CZE", gender: "m",
    height: 186, span: 187,
    tags: ["柔軟性", "外岩"],
    feature: "世界初の9cを登った岩の天才。長身なのに驚くほど柔らかく、足を高く上げる柔軟なムーブと気合いの雄たけびが有名。",
    video: "Adam Ondra bouldering"
  },
  {
    // 身長: Wikipedia / 腕の長さ: 情報なし
    name: "ヤコブ・シューベルト", en: "Jakob Schubert", country: "AUT", gender: "m",
    height: 176, span: null,
    tags: ["持久力", "リード"],
    feature: "リードで世界の頂点に立ち続けるベテラン。無駄のない効率的なムーブと、終盤まで落ちない持久力。",
    video: "Jakob Schubert bouldering"
  },
  {
    // 身長・ape +10: Wikipedia
    name: "トビー・ロバーツ", en: "Toby Roberts", country: "GBR", gender: "m",
    height: 177, span: 187,
    tags: ["リーチ", "メンタル"],
    feature: "パリ2024のボルダー&リード金メダリスト。プラスのリーチを生かしたパワームーブと、大舞台での勝負強さ。",
    video: "Toby Roberts bouldering"
  },
  {
    // 身長: 本人のReddit AMA(2014) / ape ±0: 99Boulders, Climbing House
    name: "アレックス・メゴス", en: "Alex Megos", country: "GER", gender: "m",
    height: 170, span: 170,
    tags: ["指力", "外岩"],
    feature: "外岩の超高難度ルートで知られるドイツの強豪。リーチに頼らず、極小ホールドを持てる指の強さと細かい足さばきで登る。",
    video: "Alex Megos climbing"
  },
  {
    // 身長: Park Record「6フィート強」/ ape +2.5: 99Boulders
    name: "ジミー・ウェブ", en: "Jimmy Webb", country: "USA", gender: "m",
    height: 183, span: 185,
    tags: ["パワー", "外岩"],
    feature: "長身でパワフルな外岩ボルダリングのレジェンド。大きな体を生かしたダイナミックな動きと、強傾斜での強烈な引きつけ。",
    video: "Jimmy Webb bouldering"
  },
  {
    // 身長・腕の長さ: 99Boulders, Climbing House（Wikipedia の身長は170cm）
    name: "ダニエル・ウッズ", en: "Daniel Woods", country: "USA", gender: "m",
    height: 173, span: 183,
    tags: ["リーチ", "パワー"],
    feature: "強傾斜で真価を発揮するパワー系ボルダラー。身長より10cm長い腕を生かしたランジと強烈な引きつけ。",
    video: "Daniel Woods bouldering"
  },
  {
    // 身長: IFSC選手プロフィール / ape +8: Wikipedia
    name: "メジ・シャルク", en: "Mejdi Schalck", country: "FRA", gender: "m",
    height: 172, span: 180,
    tags: ["コーディネーション", "コンペ"],
    feature: "現代コンペ型ボルダーを得意とするフランスの若手。パルクール的なコーディネーションムーブがしなやか。",
    video: "Mejdi Schalck bouldering"
  },

  // ---------- 女子 ----------
  {
    // 身長: スロベニア五輪委員会 / ape +7: Wikipedia
    name: "ヤンヤ・ガンブレット", en: "Janja Garnbret", country: "SLO", gender: "f",
    height: 164, span: 171,
    tags: ["オールラウンド", "読み"],
    feature: "五輪連覇の絶対女王。ムーブの引き出しが圧倒的に多く、どんな課題でも最適解を見つけて“完登”まで持っていく。",
    video: "Janja Garnbret bouldering"
  },
  {
    // 身長: JMSCA選手プロフィール / 腕の長さ: 情報なし
    name: "森 秋彩", en: "Ai Mori", country: "JPN", gender: "f",
    height: 154, span: null,
    tags: ["持久力", "工夫"],
    feature: "小柄な体格ながらリードで世界トップクラス。リーチ差を足使いと体の入れ方で補う、創意工夫のムーブが光る。",
    video: "Ai Mori climbing"
  },
  {
    // 身長: JMSCA選手プロフィール / 腕の長さ: 情報なし
    name: "野中 生萌", en: "Miho Nonaka", country: "JPN", gender: "f",
    height: 162, span: null,
    tags: ["パワー", "ダイナミック"],
    feature: "東京2020銀メダリスト。女子離れしたパワーとダイナミックな跳躍で、強傾斜やランジ課題をねじ伏せる。",
    video: "Miho Nonaka bouldering"
  },
  {
    // 身長: 公式プロフィール, 集英社Sportiva / 腕の長さ: 情報なし
    name: "野口 啓代", en: "Akiyo Noguchi", country: "JPN", gender: "f",
    height: 165, span: null,
    tags: ["柔軟性", "安定感"],
    feature: "W杯ボルダリング年間女王4回の第一人者。長い手足と柔軟性を生かした、伸びやかでスタティックな美しい登り。",
    video: "Akiyo Noguchi bouldering"
  },
  {
    // 身長: JMSCA選手プロフィール / 腕の長さ: 情報なし
    name: "中村 真緒", en: "Mao Nakamura", country: "JPN", gender: "f",
    height: 157, span: null,
    tags: ["バランス", "コンペ"],
    feature: "W杯で表彰台に立つボルダラー。スラブやバランス系での繊細な足さばきと、粘り強い保持。",
    video: "Mao Nakamura bouldering"
  },
  {
    // 身長: Olympics.com / ape +2.5(+1インチ): Climber News, Climbing House, The Hangboard, DPM Climbing
    //   ※ Wikipedia「Ape index」記事のみ負と記載（出典の La Sportiva の値は意味が曖昧）
    name: "ブルック・ラブトゥ", en: "Brooke Raboutou", country: "USA", gender: "f",
    height: 157, span: 160,
    tags: ["指力", "外岩"],
    feature: "パリ2024ボルダー&リード銀。小柄ながら強靭な指と体幹で、細かいホールドの強傾斜を淡々と登る。",
    video: "Brooke Raboutou bouldering"
  },
  {
    // 身長・ape +16: Wikipedia
    name: "オリアンヌ・ベルトン", en: "Oriane Bertone", country: "FRA", gender: "f",
    height: 167, span: 183,
    tags: ["リーチ", "ダイナミック"],
    feature: "若くして外岩高難度も登るフランスの天才。身長より16cmも長い腕を生かした、爆発力のあるダイナミックムーブ。",
    video: "Oriane Bertone bouldering"
  },
  {
    // 身長: IFSC選手プロフィール / 腕の長さ: 情報なし
    name: "ナタリア・グロスマン", en: "Natalia Grossman", country: "USA", gender: "f",
    height: 162, span: null,
    tags: ["コーディネーション", "読み"],
    feature: "W杯ボルダー年間女王。コーディネーション課題の飲み込みが早く、軽やかでリズミカルな登り。",
    video: "Natalia Grossman bouldering"
  },
  {
    // 身長: Wikipedia / ape +8.5: Wikipedia, Climbing House
    name: "ショーナ・コクシー", en: "Shauna Coxsey", country: "GBR", gender: "f",
    height: 164, span: 172.5,
    tags: ["パワー", "メンタル"],
    feature: "W杯ボルダー年間女王2回。パワフルな保持と勝負強さで一時代を築いたイギリスのレジェンド。",
    video: "Shauna Coxsey bouldering"
  },
  {
    // 身長: Wikipedia, Climber News / 腕の長さ164(ape +10): The Hangboard, Climber News(+4インチ)
    name: "アシマ・シライシ", en: "Ashima Shiraishi", country: "USA", gender: "f",
    height: 154, span: 164,
    tags: ["指力", "外岩"],
    feature: "10代で外岩V15を登った天才少女として有名に。細かいカチを持つ指力と、正確なフットワーク。",
    video: "Ashima Shiraishi bouldering"
  }
];

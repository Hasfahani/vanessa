// Password for the secret hidden page.
        const SECRET_PASSWORD = "forever";
        // Password for entering the website.
        const WEBSITE_PASSWORD = "Albe w 3omre w hayete";
        // Date when the love counter began.
        const LOVE_STARTED = "2026-05-16T00:00:00+02:00";

        // Keep the letters usable when browser storage is unavailable or stale.
        const safeStorage = {
            getItem(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
            setItem(key, value) { try { window.localStorage.setItem(key, value); } catch { /* Session interactions still work. */ } }
        };
        function readMemories() {
            try {
                const saved = JSON.parse(safeStorage.getItem("vanessa-secret-memories") || "[]");
                return Array.isArray(saved) ? saved.filter((item) => typeof item === "string").map((item) => item.slice(0, 2000)) : [];
            } catch { return []; }
        }

        // Relationship timeline shown on the page.
        const timelineEntries = [
            { date: "Chapter one", title: "The Day Everything Changed", text: "The moment you became more than a name on a screen and started becoming the person my heart looked for." },
            { date: "First spark", title: "Our First Hello", text: "One conversation quietly became another, and suddenly ordinary days had a reason to feel warmer." },
            { date: "The knowing", title: "When I Knew", text: "Somewhere between missing you and smiling because of you, my heart stopped pretending this was ordinary." },
            { date: "Our promise", title: "When Love Became Serious", text: "Not just sweet words, but patience, loyalty, softness, and the decision to keep choosing each other." },
            { date: "Right now", title: "Every Day Since", text: "Still choosing, still missing, still loving, still building the way back to each other." }
        ];

        // Quiz answers.
        const quizQuestions = [
            {
                question: "What does Habib think about when he can't sleep?",
                answers: ["Vanessa's smile and the future", "Random work emails", "What to eat tomorrow"],
                correct: 0
            },
            {
                question: "What is Habib's favorite thing about you?",
                answers: ["Only your beauty", "The way your heart feels like home", "Your excellent timing"],
                correct: 1
            },
            {
                question: "What does Habib want our future to look like?",
                answers: ["Close, peaceful, loyal, and forever", "Very mysterious", "A calendar full of maybes"],
                correct: 0
            },
            {
                question: "What does Habib do when he misses you?",
                answers: ["Pretends he is totally fine", "Looks forward to seeing you again", "Chooses you even harder"],
                correct: 2
            },
            {
                question: "What does Habib promise Vanessa?",
                answers: ["To always find his way back", "To be dramatic only sometimes", "To stop saying he misses her"],
                correct: 0
            }
        ];

        const reasons = [
            "✦ You make every week feel worth waiting for.",
            "♥ Your name changes my whole mood.",
            "❦ You are gentle in a way the world needs.",
            "◆ You make ordinary days feel chosen.",
            "✧ I trust the way my heart feels around you.",
            "☾ You are beautiful, but your soul is what keeps me.",
            "✦ You make me want to become better.",
            "♥ I can imagine a home inside your laugh.",
            "❦ You are my favorite thought at night.",
            "◆ You make forever feel possible.",
            "✧ You are soft and strong at once.",
            "☾ I miss you like my heart knows your direction.",
            "✦ You make love feel serious and sweet.",
            "♥ Because it is you. Always you."
        ];

        const poems = [
            ["Every week my heart can see", "the life you keep alive in me,", "your name, a candle in the blue,", "my every road returns to you."],
            ["If time becomes a test for two", "I will keep choosing only you,", "through every season, calm or storm,", "your love will always feel like home."],
            ["Vanessa, soft as morning light,", "you live inside my longest night,", "and every star I whisper through", "is just my heart looking for you."]
        ];

        const dateIdeas = [
            "A candlelit dinner where we dress up and make the night feel like a movie.",
            "A future walk at sunset with your hand in mine and nowhere urgent to be.",
            "A movie night where we press play at the same time and pause only to say I miss you.",
            "A little cafe date in a city we have not explored yet, with dessert first.",
            "A quiet night cooking together, laughing at the mess, and calling it perfect."
        ];

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const $ = (selector) => document.querySelector(selector);
        const canvas = $("#particleCanvas");
        const context = canvas.getContext("2d");
        const scrollProgress = $("#scrollProgress");
        const websiteGate = $("#websiteGate");
        const heroTitle = $("#heroTitle");
        const secretLock = $("#secretLock");
        const passwordModal = $("#passwordModal");
        const secretPanel = $("#secretPanel");
        const memoryModal = $("#memoryModal");
        let particles = [];
        let particleFrame = 0;
        let titleTaps = 0;

        function resizeCanvas() {
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * ratio);
            canvas.height = Math.floor(window.innerHeight * ratio);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        }

        function resetParticles() {
            const count = window.innerWidth < 720 ? 10 : 22;
            particles = Array.from({ length: count }, (_, index) => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: index % 5 === 0 ? 8 + Math.random() * 8 : 1 + Math.random() * 3,
                speed: index % 5 === 0 ? 0.35 + Math.random() * 0.45 : -0.18 - Math.random() * 0.38,
                drift: -0.35 + Math.random() * 0.7,
                type: index % 5 === 0 ? "petal" : "dust",
                rotation: Math.random() * Math.PI
            }));
        }

        function drawParticles() {
            particleFrame = 0;
            if (document.hidden) return;

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            particles.forEach((particle) => {
                particle.x += particle.drift;
                particle.y += particle.speed;
                particle.rotation += 0.01;

                if (particle.type === "dust" && particle.y < -10) {
                    particle.y = window.innerHeight + 10;
                    particle.x = Math.random() * window.innerWidth;
                }
                if (particle.type === "petal" && particle.y > window.innerHeight + 20) {
                    particle.y = -20;
                    particle.x = Math.random() * window.innerWidth;
                }
                if (particle.x < -30) particle.x = window.innerWidth + 30;
                if (particle.x > window.innerWidth + 30) particle.x = -30;

                context.save();
                context.translate(particle.x, particle.y);
                context.rotate(particle.rotation);
                if (particle.type === "petal") {
                    context.fillStyle = "rgba(139, 0, 0, 0.58)";
                    context.beginPath();
                    context.ellipse(0, 0, particle.size * 0.55, particle.size, Math.PI / 4, 0, Math.PI * 2);
                    context.fill();
                } else {
                    context.fillStyle = "rgba(245, 222, 142, 0.82)";
                    context.shadowColor = "rgba(201,168,76,0.9)";
                    context.shadowBlur = 12;
                    context.beginPath();
                    context.arc(0, 0, particle.size, 0, Math.PI * 2);
                    context.fill();
                }
                context.restore();
            });
            if (!prefersReducedMotion) particleFrame = requestAnimationFrame(drawParticles);
        }

        function startParticles() {
            if (prefersReducedMotion || particleFrame || document.body.classList.contains("gate-locked")) return;
            particleFrame = requestAnimationFrame(drawParticles);
        }

        function stopParticles() {
            if (!particleFrame) return;
            cancelAnimationFrame(particleFrame);
            particleFrame = 0;
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }

        function createBurst(x, y, count = 44) {
            if (prefersReducedMotion || document.body.classList.contains("gate-locked")) return;
            count = Math.min(count, window.innerWidth < 700 ? 18 : 36);
            const pieces = ["✦", "◆", "♥", "❦", "•"];
            for (let index = 0; index < count; index += 1) {
                const piece = document.createElement("span");
                const angle = (Math.PI * 2 * index) / count;
                const distance = 80 + Math.random() * 220;
                piece.className = "burst-piece";
                piece.textContent = pieces[index % pieces.length];
                piece.style.left = `${x}px`;
                piece.style.top = `${y}px`;
                piece.style.fontSize = `${11 + Math.random() * 20}px`;
                piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
                piece.style.setProperty("--y", `${Math.sin(angle) * distance + 30}px`);
                piece.style.setProperty("--r", `${-260 + Math.random() * 520}deg`);
                document.body.appendChild(piece);
                window.setTimeout(() => piece.remove(), 1500);
            }
        }

        function fullScreenBurst() {
            createBurst(window.innerWidth / 2, window.innerHeight / 2, 120);
            for (let i = 0; i < 8; i += 1) {
                window.setTimeout(() => createBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 34), i * 140);
            }
        }

        function escapeHTML(value) {
            return String(value).replace(/[&<>"']/g, (character) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#039;"
            })[character]);
        }

        function updateCountdown() {
            const elapsed = Math.max(0, Date.now() - new Date(LOVE_STARTED).getTime());
            const parts = [Math.floor(elapsed / 86400000), Math.floor(elapsed / 3600000) % 24, Math.floor(elapsed / 60000) % 60, Math.floor(elapsed / 1000) % 60];
            ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
                document.getElementById(id).textContent = String(parts[index]).padStart(2, "0");
            });
        }

        function initReveal() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("is-visible");
                });
            }, { threshold: 0.14 });
            document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        }

        function initTimeline() {
            const saved = readMemories();
            const entries = timelineEntries.concat(saved.map((text) => ({ date: "Secret memory", title: "A Memory We Added", text })));
            $("#timeline").innerHTML = entries.map((entry) => `
                <article class="timeline-item reveal">
                    <span class="timeline-dot" aria-hidden="true"></span>
                    <div class="timeline-card">
                        <span class="timeline-date">${escapeHTML(entry.date)}</span>
                        <h3>${escapeHTML(entry.title)}</h3>
                        <p>${escapeHTML(entry.text)}</p>
                    </div>
                </article>
            `).join("");
        }

        function initMeter() {
            let current = Math.max(0, Math.min(100, Number(safeStorage.getItem("vanessa-romance-meter")) || 0));
            const update = () => {
                $("#meterFill").style.width = `${current}%`;
                $(".meter-track").setAttribute("aria-valuenow", String(current));
                $("#meterLabel").textContent = `${current}% full of Vanessa.`;
            };
            $("#meterButton").addEventListener("click", (event) => {
                current = Math.min(100, current + 10);
                safeStorage.setItem("vanessa-romance-meter", String(current));
                update();
                createBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2, current === 100 ? 86 : 26);
            });
            update();
        }

        function initForever() {
            $("#foreverButton").addEventListener("click", () => {
                const button = $("#foreverButton");
                button.classList.remove("crack");
                void button.offsetWidth;
                button.classList.add("crack");
                $("#foreverNote").classList.add("show");
                const rect = button.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
            });
        }

        function initHugs() {
            let hugs = Math.max(0, Number(safeStorage.getItem("vanessa-hug-count")) || 0);
            const hugText = $("#hugText");
            const messages = [
                [100, "100 hugs. At this point, my arms are officially saving your place."],
                [50, "50 hugs. That is a whole little universe of missing you."],
                [10, "10 hugs. Enough to wrap around a hard day and make it softer."],
                [0, "hugs saved for Vanessa."]
            ];
            const update = () => {
                const milestone = messages.find(([count]) => hugs >= count);
                hugText.textContent = hugs === 0 ? "0 hugs saved for Vanessa." : `${hugs} hugs. ${milestone[1]}`;
            };
            $("#hugButton").addEventListener("click", (event) => {
                const button = event.currentTarget;
                hugs += 1;
                safeStorage.setItem("vanessa-hug-count", String(hugs));
                button.classList.add("press");
                window.setTimeout(() => button.classList.remove("press"), 220);
                update();
                createBurst(event.clientX, event.clientY, 28);
            });
            update();
        }

        function initLetter() {
            $("#envelopeButton").addEventListener("click", () => {
                const open = $("#letterPaper").classList.toggle("show");
                $("#letterPaper").hidden = !open;
                $("#envelopeButton").setAttribute("aria-expanded", String(open));
                const rect = $("#envelopeButton").getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 46);
            });
        }

        function initReasons() {
            let index = Math.max(0, Math.min(reasons.length, Math.floor(Number(safeStorage.getItem("vanessa-reason-index"))) || 0));
            const wall = $("#reasonWall");
            const counter = $("#reasonCounter");
            wall.innerHTML = reasons.map((reason, cardIndex) => `
                <button class="reason-card ${cardIndex < index ? "is-flipped" : ""}" type="button" aria-label="Reason ${cardIndex + 1}">
                    <span class="reason-card-inner">
                        <span class="reason-front">${String(cardIndex + 1).padStart(2, "0")}</span>
                        <span class="reason-back">${reason}</span>
                    </span>
                </button>
            `).join("");
            const update = () => {
                counter.textContent = `${Math.min(index, reasons.length)} of ${reasons.length} revealed`;
                $("#reasonButton").disabled = index >= reasons.length;
                $("#reasonButton").textContent = index >= reasons.length ? "Every reason revealed" : "Reveal a reason";
            };
            wall.addEventListener("click", (event) => {
                const card = event.target.closest(".reason-card");
                if (!card) return;
                card.classList.toggle("is-flipped");
                const rect = card.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
            });
            $("#reasonButton").addEventListener("click", () => {
                const card = wall.children[index];
                if (!card) return;
                card.classList.add("is-flipped");
                const rect = card.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 32);
                index += 1;
                safeStorage.setItem("vanessa-reason-index", String(index));
                update();
            });
            update();
        }

        function initPoem() {
            $("#poemButton").addEventListener("click", () => {
                const poem = poems[Math.floor(Math.random() * poems.length)];
                const display = $("#poemText");
                display.classList.remove("unfurl");
                display.textContent = "";
                void display.offsetWidth;
                display.classList.add("unfurl");
                poem.forEach((line, index) => {
                    window.setTimeout(() => {
                        display.innerHTML += `${line}${index === poem.length - 1 ? "" : "<br>"}`;
                    }, index * 520);
                });
            });
        }

        function initDateJar() {
            let last = -1;
            $("#dateButton").addEventListener("click", () => {
                let next = Math.floor(Math.random() * dateIdeas.length);
                if (dateIdeas.length > 1) {
                    while (next === last) next = Math.floor(Math.random() * dateIdeas.length);
                }
                last = next;
                $("#dateIdea").textContent = dateIdeas[next];
                $("#dateJar").classList.remove("shimmer");
                void $("#dateJar").offsetWidth;
                $("#dateJar").classList.add("shimmer");
            });
        }

        function initQuiz() {
            let questionIndex = 0;
            let score = 0;
            const questionEl = $("#quizQuestion");
            const optionsEl = $("#quizOptions");
            const messageEl = $("#quizMessage");

            function render() {
                if (questionIndex >= quizQuestions.length) {
                    const perfect = score === quizQuestions.length;
                    questionEl.textContent = perfect ? "You know his heart perfectly 💖" : `You got ${score} of ${quizQuestions.length}. His heart is still completely yours.`;
                    optionsEl.innerHTML = `<button class="gold-button" type="button" id="restartQuiz">Play again</button>`;
                    messageEl.textContent = perfect ? "Special message unlocked: Habib loves being known by you." : "Sweet try. The real answer is always Vanessa.";
                    if (perfect) fullScreenBurst();
                    $("#restartQuiz").addEventListener("click", () => {
                        questionIndex = 0;
                        score = 0;
                        render();
                    });
                    return;
                }
                const current = quizQuestions[questionIndex];
                questionEl.textContent = current.question;
                messageEl.textContent = "";
                optionsEl.innerHTML = current.answers.map((answer, index) => `<button class="gold-button quiz-answer" type="button" data-index="${index}">${answer}</button>`).join("");
            }

            optionsEl.addEventListener("click", (event) => {
                const button = event.target.closest(".quiz-answer");
                if (!button) return;
                if (button.disabled) return;
                const current = quizQuestions[questionIndex];
                const answer = Number(button.dataset.index);
                if (answer === current.correct) {
                    optionsEl.querySelectorAll("button").forEach((option) => { option.disabled = true; });
                    score += 1;
                    messageEl.textContent = "Yes! He really means this 💖";
                    const rect = button.getBoundingClientRect();
                    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
                    window.setTimeout(() => {
                        questionIndex += 1;
                        render();
                    }, 850);
                } else {
                    messageEl.textContent = "Close... but his heart knows 💛";
                    button.classList.remove("shake");
                    void button.offsetWidth;
                    button.classList.add("shake");
                }
            });
            render();
        }

        function initSecret() {
            heroTitle.addEventListener("click", () => {
                titleTaps += 1;
                if (titleTaps === 5) {
                    secretLock.classList.add("show");
                    createBurst(window.innerWidth - 42, 44, 40);
                }
            });
            secretLock.addEventListener("click", () => {
                passwordModal.classList.add("show");
                passwordModal.setAttribute("aria-hidden", "false");
                $("#passwordInput").value = "";
                $("#passwordError").textContent = "";
                window.setTimeout(() => $("#passwordInput").focus(), 60);
            });
            $("#passwordForm").addEventListener("submit", (event) => {
                event.preventDefault();
                const answer = $("#passwordInput").value.trim().toLowerCase();
                if (answer !== SECRET_PASSWORD.toLowerCase()) {
                    $("#passwordError").textContent = "Not quite. Try the word Habib means forever by.";
                    $("#passwordInput").classList.remove("shake");
                    void $("#passwordInput").offsetWidth;
                    $("#passwordInput").classList.add("shake");
                    return;
                }
                passwordModal.classList.remove("show");
                passwordModal.setAttribute("aria-hidden", "true");
                secretPanel.classList.add("show");
                secretPanel.setAttribute("aria-hidden", "false");
                fullScreenBurst();
            });
            $("#closePassword").addEventListener("click", () => {
                passwordModal.classList.remove("show");
                passwordModal.setAttribute("aria-hidden", "true");
            });
            $("#closeSecret").addEventListener("click", () => {
                secretPanel.classList.remove("show");
                secretPanel.setAttribute("aria-hidden", "true");
            });

            $("#crownButton").addEventListener("click", (event) => {
                $("#finalMessage").classList.add("show");
                fullScreenBurst();
                createBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2, 90);
            });
        }

        function initMemories() {
            $("#memoryFab").addEventListener("click", () => {
                memoryModal.classList.add("show");
                memoryModal.setAttribute("aria-hidden", "false");
            });
            $("#closeMemory").addEventListener("click", () => {
                memoryModal.classList.remove("show");
                memoryModal.setAttribute("aria-hidden", "true");
            });
            $("#memoryForm").addEventListener("submit", (event) => {
                event.preventDefault();
                const input = $("#memoryInput");
                const memories = readMemories();
                if (!input.value.trim()) return;
                memories.push(input.value.trim().slice(0, 2000));
                safeStorage.setItem("vanessa-secret-memories", JSON.stringify(memories));
                input.value = "";
                memoryModal.classList.remove("show");
                memoryModal.setAttribute("aria-hidden", "true");
                initTimeline();
                initReveal();
                createBurst(window.innerWidth / 2, window.innerHeight / 2, 52);
            });
        }

        function initAudio() {
            const toggle = $("#audioToggle");
            let audioContext;
            let master;
            let playing = false;
            let timer;

            function stop() {
                window.clearTimeout(timer);
                if (master && audioContext) master.gain.setTargetAtTime(0, audioContext.currentTime, 0.5);
                toggle.classList.remove("is-playing");
                toggle.setAttribute("aria-pressed", "false");
                playing = false;
            }

            function playTone(frequency, start, duration) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.type = "sine";
                oscillator.frequency.value = frequency;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.034, start + 0.7);
                gain.gain.setTargetAtTime(0, start + duration - 0.8, 0.45);
                oscillator.connect(gain);
                gain.connect(master);
                oscillator.start(start);
                oscillator.stop(start + duration);
            }

            function chord() {
                if (!playing) return;
                const now = audioContext.currentTime;
                const chords = [[261.63, 329.63, 392], [220, 329.63, 440], [246.94, 293.66, 392], [196, 261.63, 329.63]];
                chords[Math.floor(Math.random() * chords.length)].forEach((note, index) => playTone(index === 0 ? note / 2 : note, now + index * 0.05, 5.5));
                timer = window.setTimeout(chord, 5200);
            }

            toggle.addEventListener("click", async () => {
                if (playing) {
                    stop();
                    return;
                }
                audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
                await audioContext.resume();
                master = master || audioContext.createGain();
                master.gain.value = 0;
                master.connect(audioContext.destination);
                master.gain.setTargetAtTime(0.55, audioContext.currentTime, 0.8);
                playing = true;
                toggle.classList.add("is-playing");
                toggle.setAttribute("aria-pressed", "true");
                chord();
            });
        }

        function initScroll() {
            const update = () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                scrollProgress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
                document.body.classList.toggle("past-hero", window.scrollY > window.innerHeight * 0.72);
            };
            window.addEventListener("scroll", update, { passive: true });
            update();
        }

        function initWebsiteGate() {
            const input = $("#websiteGateInput");
            const error = $("#websiteGateError");
            const unlock = () => {
                document.body.classList.remove("gate-locked");
                document.body.classList.add("gate-unlocked");
                websiteGate.setAttribute("aria-hidden", "true");
                websiteGate.inert = true;
                $(".site").inert = false;
                $("#mainContent").focus({ preventScroll: true });
                startParticles();
            };

            $("#websiteGateForm").addEventListener("submit", (event) => {
                event.preventDefault();
                if (input.value.trim().toLowerCase() !== WEBSITE_PASSWORD.toLowerCase()) {
                    error.textContent = "Not quite. Enter the exact phrase Habib chose for you.";
                    input.classList.remove("shake");
                    void input.offsetWidth;
                    input.classList.add("shake");
                    return;
                }
                error.textContent = "";
                unlock();
            });

            window.setTimeout(() => input.focus(), 900);
        }

        function initOpenWhen() {
            const note = $("#openWhenNote");
            const cards = Array.from(document.querySelectorAll(".open-card"));
            if (!note || !cards.length) return;

            cards.forEach((card) => {
                card.addEventListener("click", () => {
                    cards.forEach((item) => {
                        item.classList.toggle("active", item === card);
                        item.setAttribute("aria-pressed", String(item === card));
                    });
                    note.textContent = card.dataset.note || "";
                    const rect = card.getBoundingClientRect();
                    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
                });
            });
        }

        function initFinale() {
            const finale = $("#foreverRoom");
            const button = $("#finaleButton");
            if (!finale || !button) return;

            button.addEventListener("click", () => {
                finale.classList.add("glowing");
                finale.classList.add("promise-open");
                createBurst(window.innerWidth / 2, window.innerHeight / 2, 70);
                button.setAttribute("aria-expanded", "true");
                window.setTimeout(() => finale.classList.remove("glowing"), 4200);
            });
        }

        function initColorMoods() {
            const moods = {
                rose: { label: "Rose garden", color: "#fbf4f5" },
                moonlight: { label: "Blue hour", color: "#f2f3fb" },
                sage: { label: "Sunday morning", color: "#f3f5ee" }
            };
            const buttons = Array.from(document.querySelectorAll(".mood-swatch"));
            function chooseMood(value) {
                const mood = Object.hasOwn(moods, value) ? value : "rose";
                document.body.dataset.mood = mood;
                $("#moodLabel").textContent = moods[mood].label;
                document.querySelector('meta[name="theme-color"]').content = moods[mood].color;
                buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mood === mood)));
                safeStorage.setItem("vanessa-color-mood", mood);
            }
            chooseMood(safeStorage.getItem("vanessa-color-mood"));
            buttons.forEach((button) => button.addEventListener("click", () => chooseMood(button.dataset.mood)));
        }

        function initDailyNotes() {
            const notes = [
                { id: "ordinary", text: "You don't have to do anything extraordinary today to be extraordinary to me. You already are, just by being you." },
                { id: "little-things", text: "If you ever wonder whether I notice the little things about you: I do. The way you care. The way you try. All the beautiful things you don't make a fuss about." },
                { id: "next-to-you", text: "My favourite plan is still the simplest one: being next to you, doing absolutely nothing, and somehow having everything." },
                { id: "gentle-day", text: "I hope today is gentle with you. And if it isn't, I hope you remember there is someone who would listen to every single word of it." },
                { id: "small-joy", text: "I hope something small makes you smile today. A good song. A little sunshine. This note. I wish I could be there to see it." },
                { id: "home", text: "You have changed the way I think about home. It used to be a place. Now, more and more, it sounds like your voice." },
                { id: "all-versions", text: "The sleepy you, the excited you, the quiet you, the you who has had a long day. I don't have a favourite version. I just love that they're all you." },
                { id: "ordinary-future", text: "When I imagine our future, it's the ordinary bits that make me happiest. Your mug next to mine. A shared umbrella. Another evening we don't have to say goodbye." },
                { id: "proud", text: "I'm proud of the things you keep trying, even when nobody sees the effort. Especially then. I hope you give yourself a little credit today." },
                { id: "notification", text: "Somewhere between our first conversations and now, your name became the notification I always hope to see." },
                { id: "no-perfect-words", text: "I won't always find the perfect words. But underneath all of them, I mean the same thing: you matter to me, and I'm so glad it's you." },
                { id: "slowly", text: "There is no rush to become anyone else. I love getting to know you slowly, in all the little ways a person keeps unfolding." },
                { id: "distance", text: "I wish there were fewer miles between this note and your hand. Until then, let these words be a little something to hold onto." },
                { id: "again", text: "If I could go back to the moment before I knew you, with everything I know now, I would still hope the next person I met was you." },
                { id: "safe-place", text: "You don't need to have an interesting story to tell me. Tell me what you had for lunch. Tell me you're tired. I just like having you in my day." },
                { id: "choose-you", text: "Out of all the grand things I could wish for, I keep coming back to this: more time with you. More ordinary, beautiful, unhurried time." },
                { id: "laughter", text: "I want more of the moments where we start laughing and can't quite remember why. The kind that make the whole day feel lighter afterward." },
                { id: "enough", text: "Here is your small reminder: you are allowed to have a quiet day. You are loved in the middle of the ordinary, too." },
                { id: "song", text: "There are songs I can't hear without thinking of you now. I like that you've quietly made a home in the things I love." },
                { id: "tomorrow", text: "Whatever today becomes, there is one thing I already know about tomorrow: I'll be glad you're in my life." }
            ];
            const byId = new Map(notes.map((note) => [note.id, note]));
            let saved;
            try {
                const stored = JSON.parse(safeStorage.getItem("vanessa-kept-notes") || "[]");
                saved = new Set(Array.isArray(stored) ? stored.filter((id) => byId.has(id)) : []);
            } catch { saved = new Set(); }
            let dayKey = "";
            let noteIndex = 0;
            const saveButton = $("#saveDailyNote");
            function updateSaveButton() {
                const kept = saved.has(notes[noteIndex].id);
                saveButton.setAttribute("aria-pressed", String(kept));
                saveButton.textContent = kept ? "♥ Kept close" : "♡ Keep this note";
            }
            function renderCollection() {
                $("#keptNotesCount").textContent = String(saved.size);
                $("#keptNotesEmpty").hidden = saved.size > 0;
                const list = $("#keptNotesList");
                list.replaceChildren();
                saved.forEach((id) => {
                    const item = document.createElement("li");
                    const text = document.createElement("span");
                    text.textContent = byId.get(id).text;
                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.textContent = "×";
                    remove.setAttribute("aria-label", "Remove this saved note: " + byId.get(id).text.slice(0, 45) + "…");
                    remove.addEventListener("click", () => {
                        saved.delete(id);
                        persistCollection();
                        $("#keptNotes").querySelector("summary").focus();
                    });
                    item.append(text, remove);
                    list.appendChild(item);
                });
                updateSaveButton();
            }
            function persistCollection() {
                const value = JSON.stringify(Array.from(saved));
                safeStorage.setItem("vanessa-kept-notes", value);
                renderCollection();
                $("#noteFeedback").textContent = safeStorage.getItem("vanessa-kept-notes") === value
                    ? (saved.size ? "A little piece of love, kept for another day." : "There is always another little thought waiting for you.")
                    : "Kept for this visit. This browser couldn't save the change for later.";
            }
            function renderNote() {
                $("#dailyNoteText").textContent = notes[noteIndex].text;
                updateSaveButton();
            }
            function refreshDay() {
                const now = new Date();
                const nextKey = [now.getFullYear(), now.getMonth(), now.getDate()].join("-");
                if (nextKey === dayKey) return;
                dayKey = nextKey;
                const ordinal = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
                noteIndex = ((ordinal % notes.length) + notes.length) % notes.length;
                $("#dailyDate").textContent = now.toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" });
                renderNote();
            }
            $("#dailyNoteOpen").addEventListener("click", () => {
                const button = $("#dailyNoteOpen");
                const open = button.getAttribute("aria-expanded") !== "true";
                button.setAttribute("aria-expanded", String(open));
                $("#dailyNoteContent").hidden = !open;
                $("#dailyNotePaper").classList.toggle("is-open", open);
                button.querySelector("small").textContent = open ? "Fold this little thought away ↗" : "Unfold your note ↗";
            });
            saveButton.addEventListener("click", () => {
                const id = notes[noteIndex].id;
                if (saved.has(id)) saved.delete(id);
                else saved.add(id);
                persistCollection();
            });
            $("#nextDailyNote").addEventListener("click", () => {
                noteIndex = (noteIndex + 1) % notes.length;
                renderNote();
                $("#noteFeedback").textContent = "Another little thought, just for you.";
            });
            document.addEventListener("visibilitychange", () => {
                if (!document.hidden) refreshDay();
            });
            refreshDay();
            renderCollection();
        }

        function initSomedayPostcards() {
            const tabs = Array.from(document.querySelectorAll("[data-postcard]"));
            function selectTab(tab, focus = false) {
                tabs.forEach((item) => {
                    const selected = item === tab;
                    item.setAttribute("aria-selected", String(selected));
                    item.tabIndex = selected ? 0 : -1;
                    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
                });
                if (focus) tab.focus();
            }
            tabs.forEach((tab, index) => {
                tab.addEventListener("click", () => selectTab(tab));
                tab.addEventListener("keydown", (event) => {
                    let next;
                    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
                    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = tabs.length - 1;
                    else return;
                    event.preventDefault();
                    selectTab(tabs[next], true);
                });
            });
        }

        window.addEventListener("load", () => {
            window.setTimeout(() => document.body.classList.add("loaded"), 650);
        });

        window.addEventListener("resize", () => {
            resizeCanvas();
            resetParticles();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopParticles();
                return;
            }
            startParticles();
        });

        resizeCanvas();
        resetParticles();
        startParticles();
        updateCountdown();
        window.setInterval(updateCountdown, 1000);
        initTimeline();
        initReveal();
        initMeter();
        initForever();
        initHugs();
        initLetter();
        initReasons();
        initPoem();
        initDateJar();
        initQuiz();
        initSecret();
        initMemories();
        initAudio();
        initScroll();
        initOpenWhen();
        initFinale();
        initWebsiteGate();
        initColorMoods();
        initDailyNotes();
        initSomedayPostcards();
        heroTitle.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                heroTitle.click();
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            [passwordModal, memoryModal, secretPanel].forEach((panel) => {
                if (!panel.classList.contains("show")) return;
                panel.classList.remove("show");
                panel.setAttribute("aria-hidden", "true");
            });
        });

/* -------------------------------------------------------------------------- */

(function () {
        'use strict';

        // ─────────────────────────────────────────────────────
        // Message content.
        // ─────────────────────────────────────────────────────

        // Messages shown when she finds each hidden heart.
        const hiddenHeartMessages = [
            "You found one 💛 — I love the way you laugh",
            "Found it! 💛 — I love how soft your heart is",
            "There you are 💛 — I love your voice in the morning",
            "You found me 💛 — I love that you still get excited about small things",
            "Last one 💛 — I love that you found all of them, just like I knew you would"
        ];

        // Reasons that rain down when the gold heart button is tapped.
        const rainReasons = [
            "Your laugh makes everything better 💛",
            "You are kinder than you know 💛",
            "Same moon, same love 🌙",
            "You are my favourite thought 💛",
            "The way you care so deeply 💛",
            "Your voice is my favourite sound 💛",
            "You make me braver 💛",
            "Your patience amazes me 💛",
            "You are softer than you think 💛",
            "I love you across every mile 💛",
            "You are so easy to love 💛",
            "Your smile is everything 💛",
            "You are genuinely one of a kind 💛",
            "I choose you every single day 💛",
            "You are my calm place 💛",
            "Being loved by you is a gift 💛"
        ];

        // Heartbeat button messages.
        const heartbeatMessages = [
            "This beats for you 💗",
            "Every single beat, just for you 💗",
            "You are what it's beating for 💗",
            "Count every one — they're all yours 💗"
        ];

        // Compliments shown one by one when "Tell me something" is pressed.
        const compliments = [
            "You have a warmth that makes any room feel like home.",
            "The way you care about people is one of the most beautiful things about you.",
            "You are genuinely one of the most thoughtful people I have ever known.",
            "Your kindness is the kind that changes people. It changed me.",
            "There is something about your laugh that makes everything better immediately.",
            "I catch myself smiling just thinking about you — like right now.",
            "You are the kind of person songs are actually written about.",
            "Loving you is the easiest thing I have ever done.",
            "You make ordinary moments feel like the ones worth remembering.",
            "I would choose you in every life, in every version of the world.",
            "The way you say my name still does something to my heart.",
            "You are softer and stronger than you give yourself credit for.",
            "Your eyes when you are happy are one of my favourite things.",
            "You have this gentle way of making people feel seen. It is rare.",
            "I love who I am when I am with you.",
            "You are dangerously adorable and I am not sure you fully know it.",
            "If sweetness were a person, it would look exactly like you.",
            "You are my favourite notification, my favourite thought, my favourite everything.",
            "You could not be annoying if you tried. I have checked.",
            "The fact that you exist and are mine is genuinely unbelievable.",
            "You carry so much grace, even on the days you do not feel it.",
            "You are the reason I believe in the kind of love people write poems about.",
            "There is nobody I would rather figure out the world with than you.",
            "You are everything I did not know I needed until you were there.",
            "My favourite version of any day is one that has you in it.",
            "You are so easy to love, Vanessa. So incredibly easy.",
            "The distance could never undo how deeply I feel for you.",
            "You are the kind of beautiful that has nothing to do with how you look."
        ];

        // Constellation reveal message.
        const constellationMessage = "Even the stars spell out us ✶";

        // The full typewriter love letter.
        const typewriterLetter = `My dearest Vanessa,\n\nIf I could write you a letter long enough to fill the distance between us, I would. Instead, know this: every single day I wake up a little more certain that you are the best thing that has ever found me.\n\nYou have this way of making me feel like everything is going to be okay, even when I am worried, even when we are far apart, even when the silence between calls stretches too long.\n\nI love your honesty. I love your heart. I love how you love the people around you. I love that you are reading this right now, somewhere out there, and I hope it makes you feel even a fraction of how much I carry you with me.\n\nThis is not just a letter. It is a promise that I will keep writing them, keep saying it, keep choosing you.\n\nAll of me, always,\nHabib \u{1F49B}`;

        // Messages shown by the floating surprise.
        const petMessages = [
            "Psst… he loves you 💛",
            "You are very cute, just so you know 🐾",
            "He asked me to remind you: you are adored 💛",
            "Even I can see how much he loves you 🐱",
            "Peek-a-boo! Just checking you are okay 💛"
        ];

        // Idle messages.
        const idleMessages = [
            "Still here? Good. Stay a while with me 💛",
            "Take your time. I am not going anywhere 💛",
            "No rush. This page belongs to you 💛"
        ];

        // ─────────────────────────────────────────────────────
        // State
        // ─────────────────────────────────────────────────────
        const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let heartsFound = 0;
        const TOTAL_HEARTS = 5;
        let complimentIdx = 0;
        let heartbeatMsgIdx = 0;
        let petMsgIdx = 0;
        let idleMsgIdx = 0;
        let idleShown = false;
        let lastActivity = Date.now();
        let isBeating = false;
        let lastScrollY = 0;
        let lastScrollTime = 0;
        let scrollHeartThrottle = null;
        let petVisible = false;
        let petBubbleEl = null;
        let twTyping = false;
        let twTimeoutId = null;

        function mk(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
        function after(ms, fn) { return window.setTimeout(fn, ms); }
        function burst(x, y, n) { if (typeof createBurst === "function") createBurst(x, y, n || 30); }

        // ─────────────────────────────────────────────────────
        // RAIN REASONS — gold heart button rains love notes
        // ─────────────────────────────────────────────────────
        const rainBtn = document.getElementById("rainBtn");

        function spawnRainNote() {
            if (prefersReduced()) return;
            const note = mk("div", "rain-note");
            note.textContent = rainReasons[Math.floor(Math.random() * rainReasons.length)];
            const x = 5 + Math.random() * 82;
            const rot = -10 + Math.random() * 20;
            note.style.left = x + "vw";
            note.style.top = "0";
            note.style.setProperty("--note-rot", rot + "deg");
            note.style.setProperty("--note-rot2", (rot + 8 + Math.random() * 6) + "deg");
            const dur = 5 + Math.random() * 3;
            note.style.setProperty("--note-dur", dur + "s");
            document.body.appendChild(note);
            after((dur + 0.5) * 1000, () => note.remove());
        }

        if (rainBtn) {
            rainBtn.addEventListener("click", () => {
                for (let i = 0; i < 8; i++) after(i * 360, spawnRainNote);
                const iv = window.setInterval(spawnRainNote, 400);
                after(8000, () => window.clearInterval(iv));
            });
        }

        // ─────────────────────────────────────────────────────
        // HIDDEN HEARTS — 5 tiny hearts scattered across sections
        // ─────────────────────────────────────────────────────
        const heartsCounter = document.getElementById("heartsCounter");
        const heartTooltip  = document.getElementById("heartTooltip");
        const allHeartsOv   = document.getElementById("allHeartsOverlay");
        const ahCloseBtn    = document.getElementById("ahCloseBtn");

        if (ahCloseBtn) ahCloseBtn.addEventListener("click", () => allHeartsOv.classList.remove("show"));
        allHeartsOv && allHeartsOv.addEventListener("click", (e) => { if (e.target === allHeartsOv) allHeartsOv.classList.remove("show"); });

        const heartPlacements = [
            { id: "dedication",      css: { top: "10px",    right: "12px" }, msg: 0 },
            { id: "reasons",         css: { bottom: "10px", left: "10px"  }, msg: 1 },
            { id: "timelineSection", css: { top: "10px",    right: "10px" }, msg: 2 },
            { id: "letter",          css: { bottom: "10px", right: "10px" }, msg: 3 },
            { id: "quiz",            css: { top: "10px",    left: "10px"  }, msg: 4 },
        ];

        function showHeartTooltip(heart, msgIdx) {
            if (!heartTooltip) return;
            heartTooltip.textContent = hiddenHeartMessages[msgIdx] || "You found a hidden heart 💛";
            heartTooltip.style.display = "block";
            heartTooltip.style.animation = "none";
            void heartTooltip.offsetWidth;
            heartTooltip.style.animation = "";
            const rect = heart.getBoundingClientRect();
            let top = rect.bottom + 12, left = rect.left + rect.width / 2;
            const tw = 230;
            if (left + tw / 2 > window.innerWidth - 10) left = window.innerWidth - tw / 2 - 10;
            if (left - tw / 2 < 10) left = tw / 2 + 10;
            if (top + 90 > window.innerHeight) top = rect.top - 98;
            heartTooltip.style.top = top + "px";
            heartTooltip.style.left = left + "px";
            heartTooltip.style.transform = "translateX(-50%)";
            after(3200, () => { heartTooltip.style.display = "none"; });
        }

        function handleHeartFound(heart, msgIdx) {
            if (heart.dataset.found === "true") return;
            heart.dataset.found = "true";
            heartsFound++;
            heart.classList.add("found");
            showHeartTooltip(heart, msgIdx);
            if (heartsCounter) {
                heartsCounter.textContent = "💛 Hidden hearts: " + heartsFound + "/" + TOTAL_HEARTS;
                heartsCounter.classList.remove("bump");
                void heartsCounter.offsetWidth;
                heartsCounter.classList.add("bump");
            }
            if (heartsFound >= TOTAL_HEARTS) {
                after(900, () => { allHeartsOv && allHeartsOv.classList.add("show"); after(50, () => ahCloseBtn && ahCloseBtn.focus()); });
            }
        }

        heartPlacements.forEach(({ id, css, msg }) => {
            const section = document.getElementById(id);
            if (!section) return;
            if (window.getComputedStyle(section).position === "static") section.style.position = "relative";
            const heart = mk("span", "hidden-heart");
            heart.textContent = "💛";
            heart.setAttribute("aria-label", "Hidden heart");
            heart.setAttribute("role", "button");
            heart.setAttribute("tabindex", "0");
            heart.dataset.found = "false";
            Object.assign(heart.style, css);
            heart.addEventListener("click",    () => handleHeartFound(heart, msg));
            heart.addEventListener("touchend", (e) => { e.preventDefault(); handleHeartFound(heart, msg); });
            heart.addEventListener("keydown",  (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleHeartFound(heart, msg); } });
            section.appendChild(heart);
        });

        // ─────────────────────────────────────────────────────
        // HEARTBEAT — Web Audio + visual pulse
        // ─────────────────────────────────────────────────────
        const heartbeatBtn = document.getElementById("heartbeatBtn");
        const heartbeatMsg = document.getElementById("heartbeatMsg");

        function playHeartbeatSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                function beat(t, decay) {
                    const osc = ctx.createOscillator(), gain = ctx.createGain();
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(90, t);
                    osc.frequency.exponentialRampToValueAtTime(32, t + 0.1);
                    gain.gain.setValueAtTime(0.45, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
                    osc.start(t); osc.stop(t + decay);
                }
                const now = ctx.currentTime;
                beat(now, 0.13); beat(now + 0.16, 0.2);
                beat(now + 0.78, 0.13); beat(now + 0.94, 0.2);
                after(2600, () => { try { ctx.close(); } catch (err) {} });
            } catch (err) {}
        }

        if (heartbeatBtn && heartbeatMsg) {
            let beatTimeout = null;
            heartbeatBtn.addEventListener("click", () => {
                if (!isBeating) {
                    isBeating = true;
                    heartbeatBtn.classList.add("beating");
                    if (!prefersReduced()) playHeartbeatSound();
                    heartbeatMsg.style.opacity = "0";
                    after(220, () => { heartbeatMsg.textContent = heartbeatMessages[heartbeatMsgIdx % heartbeatMessages.length]; heartbeatMsgIdx++; heartbeatMsg.style.opacity = "1"; });
                }
                if (beatTimeout) window.clearTimeout(beatTimeout);
                beatTimeout = after(5500, () => { isBeating = false; heartbeatBtn.classList.remove("beating"); });
            });
        }

        // ─────────────────────────────────────────────────────
        // COMPLIMENT GENERATOR — 28 sweet compliments
        // ─────────────────────────────────────────────────────
        const complimentDisplay = document.getElementById("complimentDisplay");
        const complimentBtnEl   = document.getElementById("complimentBtn");

        if (complimentDisplay && complimentBtnEl) {
            const shuffled = compliments.slice().sort(() => Math.random() - 0.5);
            complimentBtnEl.addEventListener("click", () => {
                const c = shuffled[complimentIdx % shuffled.length];
                complimentDisplay.style.opacity = "0";
                after(220, () => { complimentDisplay.textContent = `“${c}”`; complimentDisplay.style.opacity = "1"; complimentIdx++; });
                const rect = complimentBtnEl.getBoundingClientRect();
                burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
            });
        }

        // ─────────────────────────────────────────────────────
        // SHOOTING STAR — periodic, tap to catch it
        // ─────────────────────────────────────────────────────
        const starCaughtEl = document.getElementById("starCaughtMsg");

        function launchShootingStar() {
            if (prefersReduced()) return;
            const star = mk("div", "shooting-star");
            star.textContent = "⭐";
            const startX = 55 + Math.random() * 38, startY = 4 + Math.random() * 22;
            star.style.left = startX + "vw";
            star.style.top  = startY + "vh";
            const dx = -(startX + 15 + Math.random() * 35), dy = 38 + Math.random() * 32, dur = 3 + Math.random() * 2;
            star.style.setProperty("--sdx", dx + "vw");
            star.style.setProperty("--sdy", dy + "vh");
            star.style.setProperty("--star-dur", dur + "s");
            let caught = false;
            function catchStar() {
                if (caught) return; caught = true;
                star.style.opacity = "0";
                after(200, () => star.remove());
                if (starCaughtEl) { starCaughtEl.classList.add("show"); after(4200, () => starCaughtEl.classList.remove("show")); }
                const rx = parseFloat(star.style.left) / 100 * window.innerWidth;
                const ry = parseFloat(star.style.top)  / 100 * window.innerHeight;
                burst(rx, ry, 50);
            }
            star.addEventListener("click", catchStar);
            star.addEventListener("touchstart", (e) => { e.preventDefault(); catchStar(); }, { passive: false });
            document.body.appendChild(star);
            after((dur + 0.3) * 1000, () => { if (!caught) star.remove(); });
        }

        function scheduleStar() { const d = 16000 + Math.random() * 14000; after(d, () => { launchShootingStar(); scheduleStar(); }); }
        after(9000, () => { launchShootingStar(); scheduleStar(); });

        // ─────────────────────────────────────────────────────
        // CONSTELLATION — tap stars to form a heart
        // ─────────────────────────────────────────────────────
        const constField = document.getElementById("constellationField");
        const constMsg   = document.getElementById("constellationMsg");

        if (constField && constMsg) {
            const starPos = [[50,14],[32,19],[16,34],[12,51],[19,66],[34,77],[50,87],[66,77],[81,66],[88,51],[84,34],[68,19]];
            const edges   = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,0]];
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "constellation-svg");
            constField.insertBefore(svg, constField.firstChild);
            const starEls = [];
            let litCount = 0;

            starPos.forEach(([x, y], i) => {
                const btn = mk("button", "const-star-btn");
                btn.type = "button";
                btn.setAttribute("aria-label", "Star " + (i + 1));
                btn.style.left = x + "%"; btn.style.top = y + "%";
                const core = mk("div", "const-star-core");
                btn.appendChild(core);
                constField.appendChild(btn);
                starEls.push(btn);
                btn.addEventListener("click", () => {
                    if (btn.classList.contains("lit")) return;
                    btn.classList.add("lit"); litCount++;
                    edges.forEach(([a, b]) => {
                        if ((a === i && starEls[b] && starEls[b].classList.contains("lit")) ||
                            (b === i && starEls[a] && starEls[a].classList.contains("lit"))) drawConstLine(a, b);
                    });
                    if (litCount >= starPos.length) {
                        after(260, () => { constMsg.style.opacity = "0"; after(280, () => { constMsg.textContent = constellationMessage; constMsg.style.opacity = "1"; }); });
                        const fr = constField.getBoundingClientRect();
                        burst(fr.left + fr.width / 2, fr.top + fr.height / 2, 60);
                    } else {
                        constMsg.textContent = litCount + " of " + starPos.length + " stars found… ✶";
                    }
                });
            });

            function drawConstLine(a, b) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", starPos[a][0] + "%"); line.setAttribute("y1", starPos[a][1] + "%");
                line.setAttribute("x2", starPos[b][0] + "%"); line.setAttribute("y2", starPos[b][1] + "%");
                line.setAttribute("stroke", "rgba(117,227,196,0.45)");
                line.setAttribute("stroke-width", "1.5");
                line.setAttribute("stroke-linecap", "round");
                svg.appendChild(line);
            }
        }

        // ─────────────────────────────────────────────────────
        // TYPEWRITER LOVE LETTER — auto-starts on scroll into view
        // ─────────────────────────────────────────────────────
        const twDisplay = document.getElementById("twLetterDisplay");
        const twBtn     = document.getElementById("twLetterBtn");

        function startTypewriter() {
            if (twTyping) return;
            twTyping = true;
            twBtn.disabled = true;
            twBtn.textContent = "Writing…";
            twDisplay.textContent = "";
            const cursor = mk("span", "poem-cursor");
            twDisplay.appendChild(cursor);
            let i = 0;
            function typeChar() {
                if (i >= typewriterLetter.length) { twTyping = false; twBtn.disabled = false; twBtn.textContent = "Read it again 💛"; return; }
                twDisplay.textContent = typewriterLetter.slice(0, i + 1);
                twDisplay.appendChild(cursor);
                twDisplay.scrollTop = twDisplay.scrollHeight;
                i++;
                const ch = typewriterLetter[i - 1];
                const delay = ch === "\n" ? 75 : (ch === "." || ch === ",") ? 52 + Math.random() * 38 : 20 + Math.random() * 18;
                twTimeoutId = after(delay, typeChar);
            }
            typeChar();
        }

        if (twDisplay && twBtn) {
            const twSection = document.getElementById("typewriterSection");
            if (twSection && !prefersReduced()) {
                const twObs = new IntersectionObserver((entries) => {
                    entries.forEach((e) => { if (e.isIntersecting && !twTyping && !twBtn.disabled) { after(500, startTypewriter); twObs.unobserve(twSection); } });
                }, { threshold: 0.28 });
                twObs.observe(twSection);
            }
            twBtn.addEventListener("click", () => {
                if (twTimeoutId) { window.clearTimeout(twTimeoutId); twTimeoutId = null; }
                twTyping = false; twBtn.disabled = false; startTypewriter();
            });
        }

        // ─────────────────────────────────────────────────────
        // FLOATING PET — cute gold cat peeks from right edge
        // ─────────────────────────────────────────────────────
        (function () {
            const petEl = mk("div", "floating-pet");
            petEl.setAttribute("aria-label", "Friendly cat");
            petEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 56" width="64" height="56" aria-hidden="true"><ellipse cx="32" cy="42" rx="23" ry="15" fill="#c99a55"/><circle cx="32" cy="23" r="16" fill="#c99a55"/><polygon points="17,13 12,2 23,11" fill="#c99a55"/><polygon points="47,13 52,2 41,11" fill="#c99a55"/><polygon points="17,13 13,5 21,11" fill="#e8c87a" opacity="0.7"/><polygon points="47,13 51,5 43,11" fill="#e8c87a" opacity="0.7"/><circle cx="25" cy="22" r="4.5" fill="#1a0e09"/><circle cx="39" cy="22" r="4.5" fill="#1a0e09"/><circle cx="26.5" cy="20.5" r="1.5" fill="white"/><circle cx="40.5" cy="20.5" r="1.5" fill="white"/><ellipse cx="32" cy="27" rx="2.5" ry="1.5" fill="#c87050"/><path d="M29 29 Q32 32 35 29" stroke="#8b4040" stroke-width="1.2" fill="none" stroke-linecap="round"/><line x1="10" y1="26" x2="24" y2="27" stroke="#7a6030" stroke-width="0.8" opacity="0.55"/><line x1="10" y1="29" x2="24" y2="29" stroke="#7a6030" stroke-width="0.8" opacity="0.55"/><line x1="40" y1="27" x2="54" y2="26" stroke="#7a6030" stroke-width="0.8" opacity="0.55"/><line x1="40" y1="29" x2="54" y2="29" stroke="#7a6030" stroke-width="0.8" opacity="0.55"/><text x="22" y="54" font-size="13" fill="#c81e55">💛</text></svg>';
            petEl.style.right = "12px";
            petEl.style.bottom = "150px";
            petEl.style.opacity = "0";
            petEl.style.pointerEvents = "none";
            document.body.appendChild(petEl);

            function showPet() {
                petVisible = true;
                petEl.style.opacity = "1";
                petEl.style.pointerEvents = "auto";
                if (petBubbleEl) { petBubbleEl.remove(); petBubbleEl = null; }
                petBubbleEl = mk("div", "pet-bubble");
                petBubbleEl.textContent = petMessages[petMsgIdx % petMessages.length];
                petMsgIdx++;
                document.body.appendChild(petBubbleEl);
                after(30, () => { const pr = petEl.getBoundingClientRect(); petBubbleEl.style.right = "86px"; petBubbleEl.style.bottom = Math.max(20, window.innerHeight - pr.bottom + pr.height * 0.4) + "px"; });
                after(3600, hidePet);
            }
            function hidePet() { petVisible = false; petEl.style.opacity = "0"; petEl.style.pointerEvents = "none"; after(600, () => { if (petBubbleEl) { petBubbleEl.remove(); petBubbleEl = null; } }); }

            petEl.addEventListener("click",    () => petVisible ? hidePet() : showPet());
            petEl.addEventListener("touchend", (e) => { e.preventDefault(); petVisible ? hidePet() : showPet(); }, { passive: false });

            function schedulePet() { const d = 28000 + Math.random() * 18000; after(d, () => { if (!petVisible) showPet(); schedulePet(); }); }
            after(14000, schedulePet);
        })();

        // ─────────────────────────────────────────────────────
        // IDLE DETECTION — 20-second no-interaction message
        // ─────────────────────────────────────────────────────
        const idleFloatEl = document.getElementById("idleFloat");

        function resetIdle() {
            lastActivity = Date.now();
            if (idleShown && idleFloatEl) { idleShown = false; idleFloatEl.classList.remove("show"); }
        }
        function checkIdle() {
            if (!idleFloatEl || idleShown) return;
            if (Date.now() - lastActivity >= 20000) {
                idleShown = true;
                idleFloatEl.textContent = idleMessages[idleMsgIdx % idleMessages.length];
                idleMsgIdx++;
                idleFloatEl.classList.add("show");
                after(5500, () => { idleFloatEl.classList.remove("show"); idleShown = false; });
            }
        }
        ["pointermove","pointerdown","keydown","touchstart","scroll","click"].forEach((ev) => document.addEventListener(ev, resetIdle, { passive: true }));
        window.setInterval(checkIdle, 5000);

        // ─────────────────────────────────────────────────────
        // DOUBLE-TAP / DOUBLE-CLICK — heart burst at tap spot
        // ─────────────────────────────────────────────────────
        let lastTap = 0, lastTapX = 0, lastTapY = 0;

        document.addEventListener("touchend", (e) => {
            const now = Date.now(), touch = e.changedTouches[0];
            if (!touch) return;
            const dx = Math.abs(touch.clientX - lastTapX), dy = Math.abs(touch.clientY - lastTapY);
            if (now - lastTap < 340 && dx < 34 && dy < 34) { burst(touch.clientX, touch.clientY, 30); lastTap = 0; }
            else { lastTap = now; lastTapX = touch.clientX; lastTapY = touch.clientY; }
        }, { passive: true });

        document.addEventListener("dblclick", (e) => {
            if (e.target.closest("button,a,input,select,textarea")) return;
            burst(e.clientX, e.clientY, 30);
        });

        // ─────────────────────────────────────────────────────
        // FAST-SCROLL HEARTS — hearts trail on rapid scroll
        // ─────────────────────────────────────────────────────
        const scrollEmoji = ["💛", "❤", "🌸", "✶", "💕"];

        window.addEventListener("scroll", () => {
            if (prefersReduced() || scrollHeartThrottle) return;
            const now = Date.now(), dy = Math.abs(window.scrollY - lastScrollY), dt = now - lastScrollTime || 1;
            if (dy / dt > 1.1 && dy > 50) {
                for (let i = 0; i < 3; i++) {
                    after(i * 80, () => {
                        const h = mk("div", "scroll-heart");
                        h.textContent = scrollEmoji[Math.floor(Math.random() * scrollEmoji.length)];
                        h.style.left = (18 + Math.random() * 64) + "vw";
                        h.style.top  = (25 + Math.random() * 50) + "vh";
                        document.body.appendChild(h);
                        after(1100, () => h.remove());
                    });
                }
                scrollHeartThrottle = after(380, () => { scrollHeartThrottle = null; });
            }
            lastScrollY = window.scrollY; lastScrollTime = now;
        }, { passive: true });

    })();

/* -------------------------------------------------------------------------- */

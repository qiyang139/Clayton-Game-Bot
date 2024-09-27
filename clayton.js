const { HttpsProxyAgent } = require("https-proxy-agent");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const colors = require("colors");
const readline = require("readline");

const configPath = path.join(process.cwd(), "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const baseUrl = 'https://tonclayton.fun/api'

class ClayTon {
  constructor() {
    this.headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/json",
      Origin: "https://tonclayton.fun",
      Referer: "https://tonclayton.fun/",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?1",
      "Sec-Ch-Ua-Platform": '"Android"',
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    };
    this.line = "~".repeat(42).white;
  }

  async waitWithCountdown(seconds) {
    for (let i = seconds; i >= 0; i--) {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(
        `===== Đã hoàn thành tất cả tài khoản, chờ ${i} giây để tiếp tục =====`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("");
  }

  async checkProxyIP(proxy) {
    try {
      const proxyAgent = new HttpsProxyAgent(proxy);
      const response = await axios.get("https://api.myip.com/", {
        httpsAgent: proxyAgent,
      });
      if (response.status === 200) {
        return response.data.ip;
      } else {
        this.log(`❌ Lỗi khi kiểm tra IP của proxy: ${error.message}`.red);
      }
    } catch (error) {
      this.log(`❌ Lỗi khi kiểm tra IP của proxy: ${error.message}`.red);
    }
  }

  log(msg, proxyIP) {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    console.log(`[zepmoo] [${time}] > ${proxyIP} | ${msg}`.cyan);
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async title() {
    console.clear();
    console.log(`
                        ███████╗███████╗██████╗ ███╗   ███╗ ██████╗ 
                        ╚══███╔╝██╔════╝██╔══██╗████╗ ████║██╔═══██╗
                          ███╔╝ █████╗  ██████╔╝██╔████╔██║██║   ██║
                         ███╔╝  ██╔══╝  ██╔═══╝ ██║╚██╔╝██║██║   ██║
                        ███████╗███████╗██║     ██║ ╚═╝ ██║╚██████╔╝
                        ╚══════╝╚══════╝╚═╝     ╚═╝     ╚═╝ ╚═════╝ 
                        `);
    console.log(
      colors.yellow(
        "Tool này được làm bởi Zepmo. Nếu bạn thấy hay thì hãy ủng hộ mình 1 subscribe nhé!"
      )
    );
    console.log(colors.blue("Contact Telegram: @zepmoairdrop \n"));
  }

  async login(data, proxy, index, proxyIP) {
    const url = baseUrl + "/user/login"
    const header = {
        ...this.headers,
        "init-data": data
    }
    try {
        const res = await axios.post(url, {}, {
            headers: header,
            httpsAgent: new HttpsProxyAgent(proxy)
        })
        if (res?.data?.user) {
            const user = res.data.user;
            this.log(`[Account ${index}] ${user.username} | Balance: ${user.tokens} CL | ${user.daily_attempts} Tickets!`.blue, proxyIP)
            const ticket = res.data.user.daily_attempts
            return {ticket, user}
        }
        else {
            this.log(`[Account ${index}] Lỗi khi đăng nhập: ${res.data.message}`.red, proxyIP)
        }
    } catch (error) {
        this.log(`[Account ${index}] Lỗi khi đăng nhập: ${error.message}`.red, proxyIP)
    }
}

    async checkIn(data, proxy, index, proxyIP) {
        const url = baseUrl + "/user/daily-claim"
        const header = {
            ... this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "daily reward claimed successfully") {
                this.log(`[Account ${index}] Nhận thưởng checkin thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi nhận thưởng checkin: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi nhận thưởng checkin: ${error.message}`.red, proxyIP)
    }
}

async getTask(data, proxy, index, proxyIP) {
    const url = baseUrl + "/user/partner/get"
    const header = {
        ...this.headers,
        "init-data": data
    }
    try {
        const res = await axios.post(url, {}, {
            headers: header,
            httpsAgent: new HttpsProxyAgent(proxy)
        })
        if (res?.data) {
            return res.data
        }
        else {
            this.log(`[Account ${index}] Không có task!`.yellow, proxyIP)
        }
    } catch (error) {
        this.log(`[Account ${index}] Lỗi khi lấy task: ${error.message}`.red, proxyIP)
    }
}

    async doTask(data, proxy, index, proxyIP, task) {
        const url = baseUrl + "/user/partner/complete/" + task.task_id
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Task completed") {
                this.log(`[Account ${index}] Hoàn thành task ${task?.task_name?.white}!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi hoàn thành task ${task?.task_name?.white}}: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi hoàn thành task ${task?.task_name?.white}}: ${error.message}`.red, proxyIP)
        }
    }

    async claimTask(data, proxy, index, proxyIP, task) {
        const url = baseUrl + "/user/partner/reward/" + task.task_id
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Task completed") {
                this.log(`[Account ${index}] Nhận thưởng thành công task ${task?.task_name?.white}!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi nhận thưởng task ${task?.task_name?.white}}: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi nhận thưởng task ${task?.task_name?.white}: ${error.message}`.red, proxyIP)
        }
    }

    async getDailyTask(data, proxy, index, proxyIP) {
        const url = baseUrl + "/user/daily-tasks"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data) {
                return res.data
            }
            else {
                this.log(`[Account ${index}] Không có daily task!`.yellow, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi lấy daily task: ${error.message}`.red, proxyIP)
        }
    }

    async doDailyTask(data, proxy, index, proxyIP, task) {
        const url = baseUrl + `/user/daily-task/${task.id}/complete`
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Task completed successfully") {
                this.log(`[Account ${index}] Hoàn thành daily task ${task.task_type}!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi hoàn thành daily task ${task.task_type}: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi hoàn thành daily task ${task.task_type}: ${error.message}`.red, proxyIP)
        }
    }   

    async claimDailyTask(data, proxy, index, proxyIP, task) {
        const url = baseUrl + `/user/daily-task/${task.id}/claim`
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Reward claimed successfully") {
                this.log(`[Account ${index}] (+) ${res?.data?.reward} | Nhận thưởng daily task ${task.task_type}!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi nhận thưởng daily task ${task.task_type}: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi nhận thưởng daily task ${task.task_type}: ${error.message}`.red, proxyIP)
        }
    }

    async getArchivement(data, proxy, index, proxyIP) {
        const url = baseUrl + "/user/achievements/get"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data) {
                return res.data
            }
            else {
                this.log(`[Account ${index}] Không có archivement!`.yellow, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi lấy archivement: ${error.message}`.red, proxyIP)
        }
    }

    async claimArchivement(data, proxy, index, proxyIP, type, level) {
        const url = baseUrl + `/user/achievements/claim`
        const header = {
            ...this.headers,
            "init-data": data
        }
        const payload = {
            "type": type,
            "level": level
        }
        try {
            const res = await axios.post(url, payload, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.reward) {
                this.log(`[Account ${index}] (+) ${res?.data?.reward} | Nhận thưởng ${type} level ${level} thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi nhận thưởng ${type} Level ${level}: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi nhận thưởng ${type} Level ${level}: ${error.message}`.red, proxyIP)
        }
    }

    async startGame(data, proxy, index, proxyIP) {
        const url = baseUrl + "/game/start"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Game started successfully") {
                this.log(`[Account ${index}] Bắt đầu game 1024 thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi bắt đầu game 1024: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi bắt đầu game 1024: ${error.message}`.red, proxyIP)
        }
    }

    async saveTile(data, proxy, index, proxyIP, tile) {
        const url = baseUrl + "/game/save-tile"
        const header = {
            ...this.headers,
            "init-data": data
        }
        const payload = {
            maxTile: tile
        }
        try {
            const res = await axios.post(url, payload, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "MaxTile saved successfully") {
                this.log(`[Account ${index}] Lưu trạng thái game 1024 thành công!`.magenta, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi lưu trạng thái game 1024: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi lưu trạng thái game 1024: ${error.message}`.red, proxyIP)
        }
    }

    async overGame(data, proxy, index, proxyIP) {
        const url = baseUrl + "/game/over"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.earn) {
                this.log(`[Account ${index}] (+) ${res.data.earn} CL | Kết thúc game 1024 thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi kết thúc game 1024: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi kết thúc game 1024: ${error.message}`.red, proxyIP)
    }
}

    async play1024(data, proxy, index, proxyIP) {
        await this.startGame(data, proxy, index, proxyIP)
        await this.sleep(5000)
        for (let i = 4; i <= 512; i *= 2) {
            await this.saveTile(data, proxy, index, proxyIP, i)
            await this.sleep(5000)
        }
        await this.overGame(data, proxy, index, proxyIP)
    }

    async startStack(data, proxy, index, proxyIP) {
        const url = baseUrl + "/stack/start"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.session_id) {
                this.log(`[Account ${index}] Bắt đầu game Stack thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi bắt đầu game: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi bắt đầu game: ${error.message}`.red, proxyIP)
        }
    }

    async updateStack(data, proxy, index, proxyIP, score) {
        const url = baseUrl + "/stack/update"
        const header = {
            ...this.headers,
            "init-data": data
        }
        const payload = {
            "score": score
        }
        try {
            const res = await axios.post(url, payload, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.message == "Score updated successfully") {
                this.log(`[Account ${index}] Cập nhật game Stack thành công!`.magenta, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi cập nhật game Stack: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi cập nhật game Stack: ${error.message}`.red, proxyIP)
        }
    }

    async endStack(data, proxy, index, proxyIP, score) {
        const url = baseUrl + "/stack/end"
        const header = {
            ...this.headers,
            "init-data": data
        }
        const payload = {
            "score": score
        }
        try {
            const res = await axios.post(url, payload, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.earn) {
                this.log(`[Account ${index}] (+) ${res.data.earn} CL | Kết thúc game Stack thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi kết thúc game Stack: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi kết thúc game Stack: ${error.message}`.red, proxyIP)
        }
    }

    async playStack(data, proxy, index, proxyIP) {
        await this.startStack(data, proxy, index, proxyIP)
        await this.sleep(5000)
        for (let i = 10; i <= 50; i+=10) {
            await this.updateStack(data, proxy, index, proxyIP, i)
            await this.sleep(5000)
        }
        await this.endStack(data, proxy, index, proxyIP, 50)
    }

    async startFarming(data, proxy, index, proxyIP) {
        const url = baseUrl + "/user/start"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.start_time) {
                this.log(`[Account ${index}] Bắt đầu farming thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi bắt đầu farming: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi bắt đầu farming: ${error.message}`.red, proxyIP)
        }
    }

    async claimFarming(data, proxy, index, proxyIP) {
        const url = baseUrl + "/user/claim"
        const header = {
            ...this.headers,
            "init-data": data
        }
        try {
            const res = await axios.post(url, {}, {
                headers: header,
                httpsAgent: new HttpsProxyAgent(proxy)
            })
            if (res?.data?.earn) {
                this.log(`[Account ${index}] (+) ${res.data.claim} CL | Nhận thưởng farming thành công!`.green, proxyIP)
            }
            else {
                this.log(`[Account ${index}] Lỗi khi nhận thưởng farming: ${res.data.message}`.red, proxyIP)
            }
        } catch (error) {
            this.log(`[Account ${index}] Lỗi khi nhận thưởng farming: ${error.message}`.red, proxyIP)
        }
    }

  async process(data, proxy, index) {
    const proxyIP = await this.checkProxyIP(proxy);
    const {ticket, user} = await this.login(data, proxy, index, proxyIP)
    const isCheckin = user?.dailyReward?.can_claim_today || true;
    const isClaim = user?.can_claim || false;
    const isFarming = user?.active_farm;

    if (isCheckin == false) {
        await this.checkIn(data, proxy, index, proxyIP)
    }
    const task = await this.getTask(data, proxy, index, proxyIP)
    if (task) {
        for (const t of task) {
            if (t?.is_completed == false) {
                await this.doTask(data, proxy, index, proxyIP, t)
                await this.sleep(4000)
                await this.claimTask(data, proxy, index, proxyIP, t)
            }
            else if (t?.is_completed == true && t?.is_rewarded == false) {
                await this.claimTask(data, proxy, index, proxyIP, t)
            }
        }
    }
    const dailyTask = await this.getDailyTask(data, proxy, index, proxyIP)
    if (dailyTask) {
        for (const t of dailyTask) {
            if (t?.is_completed == false) {
                await this.doDailyTask(data, proxy, index, proxyIP, t)
                await this.sleep(4000)
                await this.claimDailyTask(data, proxy, index, proxyIP, t)
            }
            else if (t?.is_completed == true && t?.is_reward == false) {
                await this.claimDailyTask(data, proxy, index, proxyIP, t)
            }
        }
    }

    const archivement = await this.getArchivement(data, proxy, index, proxyIP)
    if (archivement) {
        //friend
        const friendArchive = archivement?.friends
        for (const f of friendArchive) {
            if (f?.is_completed == true && f?.is_rewarded == false) {
                await this.claimArchivement(data, proxy, index, proxyIP, "friends", f.level)
            }
        }
        //games
        const gameArchive = archivement?.games
        for (const g of gameArchive) {
            if (g?.is_completed == true && g?.is_rewarded == false) {
                await this.claimArchivement(data, proxy, index, proxyIP, "games", g.level)
            }
        }
        //stars
        const starArchive = archivement?.stars
        for (const s of starArchive) {
            if (s?.is_completed == true && s?.is_rewarded == false) {
                await this.claimArchivement(data, proxy, index, proxyIP, "stars", s.level)
            }
        }
        //ton
        const tonArchive = archivement?.ton
        for (const t of tonArchive) {
            if (t?.is_completed == true && t?.is_rewarded == false) {
                await this.claimArchivement(data, proxy, index, proxyIP, "ton", t.level)
            }
        }
    }

    for (let i = 0 ; i < ticket ; i++) {
        const random = Math.floor(Math.random() * 2) + 1
        if (random == 1) {
            await this.play1024(data, proxy, index, proxyIP)
        }
        else if (random == 2) {
            await this.playStack(data, proxy, index, proxyIP)
        }
    }

    if (isClaim) {
        await this.claimFarming(data, proxy, index, proxyIP)
        this.sleep(4000)
        await this.startFarming(data, proxy, index, proxyIP)
    }
    else if(isFarming == false) {
        await this.startFarming(data, proxy, index, proxyIP)
    }
  }

  async main() {
    await this.title();
    const dataFile = path.join(__dirname, "data.txt");
    const data = fs
      .readFileSync(dataFile, "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

    const proxyFile = path.join(__dirname, "proxy.txt");
    const proxyList = fs
      .readFileSync(proxyFile, "utf8")
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

    if (data.length <= 0) {
      this.log("No accounts added!".red);
      process.exit();
    }

    if (proxyList.length <= 0) {
      this.log("No proxies added!".red);
      process.exit();
    }

    while (true) {
      const threads = [];
      for (const [index, tgData] of data.entries()) {
        const proxy = proxyList[index] || proxyList[index % proxyList.length];
        threads.push(this.process(tgData, proxy, index + 1));
        if (threads.length >= config.threads) {
          console.log(`Running ${threads.length} threads process...`.bgYellow);
          await Promise.all(threads);
          threads.length = 0;
        }
      }
      if (threads.length > 0) {
        console.log(`Running ${threads.length} threads process...`.bgYellow);
        await Promise.all(threads);
      }
      await this.waitWithCountdown(config.wait_time);
    }
  }
}

if (require.main === module) {
  process.on("SIGINT", () => {
    process.exit();
  });
  new ClayTon().main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

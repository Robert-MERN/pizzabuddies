
export const get_cookie = (cookie_name, { req, res }) => {
    const cookie_header = req.headers.cookie || "";
    const cookies = Object.fromEntries(cookie_header.split(";").map(e => {
        const obj_arr = e.split("=");
        const key = String(obj_arr[0]).trim();
        const value = String(obj_arr[1]).trim();
        return [key, value];
    }));
    return cookies[cookie_name] || null;
}

export const get_cookies = ({ req, res }) => {
    const cookie_header = req.headers.cookie || "";
    const cookies = Object.fromEntries(cookie_header.split(";").map(e => {
        const [key, value] = e.split("=");
        const trim_key = String(key).trim();
        return [trim_key, value];
    }));
    return cookies;
}


export const set_cookie = (cookie_name, cookie_value, { req, res, expires }) => {
    let stringify_value;
    if (typeof cookie_value === "object") {
        stringify_value = JSON.stringify(cookie_value);
    } else {
        stringify_value = cookie_value.toString()
    }
    return res.setHeader('Set-Cookie', `${cookie_name}=${stringify_value}; Path=/; Max-Age=${expires}; sameSite=Strict`);
}
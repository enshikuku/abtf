module.exports = {
    apps: [
        {
            name: "abtf",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3002,
            },
        },
    ],
};

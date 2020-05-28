import config from 'react-global-configuration';

config.set({ "backend": { "url": "http://localhost:5000" } });

config.set({
	"backend": { "url": "" }
}, { environment: "prod" });

import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Form, Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, createCookieSessionStorage, isRouteErrorResponse, redirect, useActionData, useLoaderData } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import axios from "axios";
import { useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.pnpm/@react-router+dev@7.14.0_@react-router+serve@7.14.0_react-router@7.14.0_react-dom@19.2._79714a72f317b5c5789d1eadc16e61cd/node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	action: () => action$4,
	default: () => root_default,
	links: () => links
});
async function action$4({ request }) {
	if (request.method === "POST") return new Response(null, {
		status: 303,
		headers: { Location: "/" }
	});
	return null;
}
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "apple-mobile-web-app-capable",
				content: "yes"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#0066CC"
			}),
			/* @__PURE__ */ jsx("title", { children: "NeuroMapper" }),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "Ocorreu um erro inesperado.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Erro";
		details = error.status === 404 ? "A página solicitada não foi encontrada." : error.statusText || details;
	} else if (error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold",
				children: message
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2",
				children: details
			}),
			stack && /* @__PURE__ */ jsx("pre", {
				className: "w-full p-4 overflow-x-auto mt-4 bg-gray-100 rounded",
				children: /* @__PURE__ */ jsx("code", { children: stack })
			})
		]
	});
});
//#endregion
//#region app/lib/session.server.ts
var sessionStorage = createCookieSessionStorage({ cookie: {
	name: "__neuromapper_session",
	httpOnly: true,
	maxAge: 3600 * 24 * 7,
	path: "/",
	sameSite: "lax",
	secrets: [process.env.SESSION_SECRET || "neuro-mapper-secret-key-2024"],
	secure: process.env.NODE_ENV === "production"
} });
async function getSession(request) {
	return sessionStorage.getSession(request.headers.get("Cookie"));
}
async function commitSession(session) {
	return sessionStorage.commitSession(session);
}
async function destroySession(session) {
	return sessionStorage.destroySession(session);
}
async function requireAuth(request) {
	const session = await getSession(request);
	const token = session.get("token");
	const user = session.get("user");
	if (!token || !user) throw redirect("/login");
	return {
		token,
		user
	};
}
//#endregion
//#region app/components/app-layout.tsx
var tabs = [
	{
		name: "Home",
		icon: "🏠",
		path: "/",
		adminOnly: false
	},
	{
		name: "Escalas",
		icon: "📊",
		path: "/escalas",
		adminOnly: false
	},
	{
		name: "Ciclos",
		icon: "🔄",
		path: "/ciclos",
		adminOnly: false
	},
	{
		name: "Pacientes",
		icon: "👥",
		path: "/pacientes",
		adminOnly: false
	},
	{
		name: "Sessão",
		icon: "➕",
		path: "/nova-sessao",
		adminOnly: false
	},
	{
		name: "Efetividade",
		icon: "📈",
		path: "/efetividade",
		adminOnly: false
	},
	{
		name: "Config",
		icon: "⚙️",
		path: "/configuracoes",
		adminOnly: false
	},
	{
		name: "Perfil",
		icon: "👤",
		path: "/perfil",
		adminOnly: false
	},
	{
		name: "Admin",
		icon: "🔐",
		path: "/admin",
		adminOnly: true
	}
];
function AppLayout({ children, userName, userRole }) {
	const visibleTabs = tabs.filter((t) => !t.adminOnly || userRole === "admin");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-gray-50",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[200] px-4 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xl",
						children: "🧠"
					}), /* @__PURE__ */ jsx("span", {
						className: "font-bold text-gray-900 text-sm",
						children: "NeuroLaserMap"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [userName && /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-gray-500 hidden sm:inline",
						children: ["Olá, ", userName]
					}), /* @__PURE__ */ jsx(Form, {
						method: "post",
						action: "/logout",
						children: /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-[0.97]",
							children: "🚪 Sair"
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				className: "pt-14 pb-20 min-h-screen",
				children
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[200] flex overflow-x-auto",
				children: visibleTabs.map((tab) => /* @__PURE__ */ jsxs(NavLink, {
					to: tab.path,
					className: ({ isActive }) => `flex-1 min-w-[60px] flex flex-col items-center justify-center py-2 px-1 text-center transition-colors ${isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`,
					end: tab.path === "/",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-lg leading-none",
						children: tab.icon
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] mt-0.5 leading-tight",
						children: tab.name
					})]
				}, tab.path))
			})
		]
	});
}
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	loader: () => loader$11,
	meta: () => meta$8
});
async function loader$11({ request }) {
	const { user, token } = await requireAuth(request);
	let stats = {
		totalPatients: 0,
		activePatients: 0,
		pausedPatients: 0,
		completedPatients: 0
	};
	try {
		stats = {
			totalPatients: 0,
			activePatients: 0,
			pausedPatients: 0,
			completedPatients: 0
		};
	} catch (e) {
		console.error("Error loading stats:", e);
	}
	return {
		user,
		stats
	};
}
function meta$8() {
	return [{ title: "NeuroLaserMap - Home" }, {
		name: "description",
		content: "Sistema de Mapeamento de Neuromodulação"
	}];
}
var home_default = UNSAFE_withComponentProps(function HomePage() {
	const { user, stats } = useLoaderData();
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: "/images/branding-hero.jpg",
							alt: "NeuroLaserMap",
							className: "w-28 h-28 rounded-3xl mx-auto mb-3 object-contain shadow-lg"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold text-gray-900",
							children: "NeuroLaserMap"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-500",
							children: "Sistema de Mapeamento de Neuromodulação"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-xl font-bold text-gray-900",
						children: [
							"Olá, ",
							user.name || user.email,
							" 👋"
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-gray-500 text-sm",
						children: "Bem-vindo ao sistema de mapeamento"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold text-gray-900 mb-3",
						children: "Estatísticas"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "👥"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: stats.totalPatients
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500 font-medium",
										children: "Total Pacientes"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "✅"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: stats.activePatients
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500 font-medium",
										children: "Ativos"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "📅"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: "0"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500 font-medium",
										children: "Sessões Hoje"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "📊"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: "0"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500 font-medium",
										children: "Esta Semana"
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-gray-900 mb-3",
							children: "Ações Rápidas"
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/pacientes",
							className: "flex items-center gap-3 bg-blue-600 text-white p-4 rounded-xl mb-3 hover:bg-blue-700 transition-colors active:scale-[0.98]",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl",
									children: "👥"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "flex-1 font-semibold",
									children: "Ver Todos os Pacientes"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xl",
									children: "›"
								})
							]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/nova-sessao",
							className: "flex items-center gap-3 bg-green-50 border border-green-300 text-green-700 p-4 rounded-xl mb-3 hover:bg-green-100 transition-colors active:scale-[0.98]",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl",
									children: "📄"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "flex-1 font-semibold",
									children: "Nova Sessão de Tratamento"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xl",
									children: "›"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold text-gray-900 mb-3",
						children: "Módulos"
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
						children: [
							{
								title: "Escalas Clínicas",
								icon: "📊",
								desc: "22 escalas profissionais com cálculos automáticos",
								path: "/escalas",
								gradient: "from-blue-500 to-blue-600"
							},
							{
								title: "Ciclos Terapêuticos",
								icon: "🔄",
								desc: "Gerenciar ciclos de tratamento",
								path: "/ciclos",
								gradient: "from-green-500 to-green-600"
							},
							{
								title: "Pacientes",
								icon: "👥",
								desc: "Cadastro e gerenciamento de pacientes",
								path: "/pacientes",
								gradient: "from-purple-500 to-purple-600"
							},
							{
								title: "Nova Sessão",
								icon: "➕",
								desc: "Registrar nova sessão de tratamento",
								path: "/nova-sessao",
								gradient: "from-orange-500 to-orange-600"
							},
							{
								title: "Efetividade",
								icon: "📈",
								desc: "Análise de efetividade do tratamento",
								path: "/efetividade",
								gradient: "from-teal-500 to-teal-600"
							},
							{
								title: "Configurações",
								icon: "⚙️",
								desc: "Configurar sistema e preferências",
								path: "/configuracoes",
								gradient: "from-gray-500 to-gray-600"
							}
						].map((action) => /* @__PURE__ */ jsxs(Link, {
							to: action.path,
							className: "bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all active:scale-[0.97] group",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl mb-2",
									children: action.icon
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors",
									children: action.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500 mt-1 line-clamp-2",
									children: action.desc
								})
							]
						}, action.path))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-t-2 border-gray-200 pt-6 pb-4 text-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "bg-gray-50 rounded-lg p-3 border-l-4 border-blue-600 mb-3 text-left",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold text-blue-600 uppercase tracking-wide",
							children: "Desenvolvido por: Carlos Charone"
						})
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-gray-400 italic",
						children: "NeuroLaserMap - Sistema de Mapeamento de Neuromodulação"
					})]
				})
			]
		})
	});
});
//#endregion
//#region app/lib/api.server.ts
var API_BASE_URL = process.env.API_URL || "http://127.0.0.1:3000";
var api = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
	timeout: 1e4
});
async function apiLogin(email, password) {
	return (await api.post("/api/pwa-auth/login", {
		email,
		password
	})).data;
}
async function apiRegister(email, password, name) {
	return (await api.post("/api/pwa-auth/register", {
		email,
		name,
		password
	})).data;
}
async function apiGetUsers(token) {
	return (await api.get("/api/pwa-auth/users", { headers: { Authorization: `Bearer ${token}` } })).data.users;
}
async function apiApproveUser(token, email) {
	await api.post("/api/pwa-auth/approve", { email }, { headers: { Authorization: `Bearer ${token}` } });
}
async function apiRejectUser(token, email) {
	await api.post("/api/pwa-auth/reject", { email }, { headers: { Authorization: `Bearer ${token}` } });
}
//#endregion
//#region app/routes/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({
	action: () => action$3,
	default: () => login_default,
	loader: () => loader$10
});
async function loader$10({ request }) {
	if ((await getSession(request)).get("token")) return redirect("/");
	return {};
}
async function action$3({ request }) {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	if (!email || !password) return { error: "Email e senha são obrigatórios" };
	try {
		const { token, user } = await apiLogin(email, password);
		const session = await getSession(request);
		session.set("token", token);
		session.set("user", user);
		return redirect("/", { headers: { "Set-Cookie": await commitSession(session) } });
	} catch (error) {
		return { error: error.response?.data?.message || error.response?.data?.error || "Erro ao fazer login" };
	}
}
var login_default = UNSAFE_withComponentProps(function LoginPage() {
	const actionData = useActionData();
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-4xl",
								children: "🧠"
							})
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-3xl font-bold text-blue-600",
							children: "NeuroMapper"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-gray-500 mt-2",
							children: "Mapeamento de Neuromodulação"
						})
					]
				}),
				/* @__PURE__ */ jsxs(Form, {
					method: "post",
					className: "space-y-5",
					children: [
						actionData?.error && /* @__PURE__ */ jsx("div", {
							className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm",
							children: actionData.error
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "email",
							className: "block text-sm font-medium text-gray-700 mb-1.5",
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							id: "email",
							name: "email",
							required: true,
							autoComplete: "email",
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
							placeholder: "seu@email.com"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "password",
							className: "block text-sm font-medium text-gray-700 mb-1.5",
							children: "Senha"
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							id: "password",
							name: "password",
							required: true,
							autoComplete: "current-password",
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
							placeholder: "••••••••"
						})] }),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200",
							children: "Entrar"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ jsxs("p", {
						className: "text-gray-500 text-sm",
						children: [
							"Não tem conta?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/register",
								className: "text-blue-600 hover:text-blue-700 font-semibold",
								children: "Cadastre-se"
							})
						]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/register.tsx
var register_exports = /* @__PURE__ */ __exportAll({
	action: () => action$2,
	default: () => register_default,
	loader: () => loader$9
});
async function loader$9({ request }) {
	if ((await getSession(request)).get("token")) return redirect("/");
	return {};
}
async function action$2({ request }) {
	const formData = await request.formData();
	const name = formData.get("name");
	const email = formData.get("email");
	const password = formData.get("password");
	if (!name || !email || !password) return { error: "Todos os campos são obrigatórios" };
	try {
		const { token, user } = await apiRegister(email, password, name);
		const session = await getSession(request);
		session.set("token", token);
		session.set("user", user);
		return redirect("/", { headers: { "Set-Cookie": await commitSession(session) } });
	} catch (error) {
		return { error: error.response?.data?.message || error.response?.data?.error || "Erro ao criar conta" };
	}
}
var register_default = UNSAFE_withComponentProps(function RegisterPage() {
	const actionData = useActionData();
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-4xl",
								children: "🧠"
							})
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-3xl font-bold text-blue-600",
							children: "NeuroMapper"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-gray-500 mt-2",
							children: "Criar nova conta"
						})
					]
				}),
				/* @__PURE__ */ jsxs(Form, {
					method: "post",
					className: "space-y-5",
					children: [
						actionData?.error && /* @__PURE__ */ jsx("div", {
							className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm",
							children: actionData.error
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "name",
							className: "block text-sm font-medium text-gray-700 mb-1.5",
							children: "Nome completo"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							id: "name",
							name: "name",
							required: true,
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
							placeholder: "Seu nome"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "email",
							className: "block text-sm font-medium text-gray-700 mb-1.5",
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							id: "email",
							name: "email",
							required: true,
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
							placeholder: "seu@email.com"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "password",
							className: "block text-sm font-medium text-gray-700 mb-1.5",
							children: "Senha"
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							id: "password",
							name: "password",
							required: true,
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
							placeholder: "••••••••"
						})] }),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200",
							children: "Criar Conta"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ jsxs("p", {
						className: "text-gray-500 text-sm",
						children: [
							"Já tem conta?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/login",
								className: "text-blue-600 hover:text-blue-700 font-semibold",
								children: "Faça login"
							})
						]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/logout.tsx
var logout_exports = /* @__PURE__ */ __exportAll({
	action: () => action$1,
	loader: () => loader$8
});
async function action$1({ request }) {
	return redirect("/login", { headers: { "Set-Cookie": await destroySession(await getSession(request)) } });
}
async function loader$8() {
	return redirect("/login");
}
//#endregion
//#region app/routes/escalas.tsx
var escalas_exports = /* @__PURE__ */ __exportAll({
	default: () => escalas_default,
	loader: () => loader$7,
	meta: () => meta$7
});
var ALL_SCALES = [
	{
		type: "doss",
		name: "Escala do Comer (DOSS)",
		description: "Avalia a gravidade da disfagia e o resultado funcional",
		category: "Deglutição",
		totalItems: 7
	},
	{
		type: "btss",
		name: "Escala de Triagem de Disfagia (BTSS)",
		description: "Triagem rápida para identificar risco de disfagia",
		category: "Deglutição",
		totalItems: 5
	},
	{
		type: "bdae",
		name: "Escala de Afasia de Boston (BDAE)",
		description: "Avaliação da linguagem e comunicação",
		category: "Linguagem",
		totalItems: 8
	},
	{
		type: "cm",
		name: "Escala de Coma de Glasgow (CM)",
		description: "Avalia o nível de consciência",
		category: "Neurológica",
		totalItems: 3
	},
	{
		type: "sara",
		name: "Escala SARA (Ataxia)",
		description: "Avaliação e classificação da ataxia",
		category: "Neurológica",
		totalItems: 8
	},
	{
		type: "qcs",
		name: "Questionário de Qualidade de Comunicação (QCS)",
		description: "Avalia a qualidade da comunicação",
		category: "Comunicação",
		totalItems: 10
	},
	{
		type: "pdq39",
		name: "PDQ-39 (Parkinson)",
		description: "Qualidade de vida na doença de Parkinson",
		category: "Parkinson",
		totalItems: 39
	},
	{
		type: "fois",
		name: "FOIS (Functional Oral Intake)",
		description: "Escala funcional de ingestão oral",
		category: "Deglutição",
		totalItems: 1
	},
	{
		type: "dsfs",
		name: "DSFS (Dysphagia Severity)",
		description: "Severidade da disfagia funcional",
		category: "Deglutição",
		totalItems: 6
	},
	{
		type: "grbasi",
		name: "GRBASI (Qualidade Vocal)",
		description: "Avaliação perceptivo-auditiva da voz",
		category: "Voz",
		totalItems: 6
	},
	{
		type: "eat10",
		name: "EAT-10 (Eating Assessment)",
		description: "Ferramenta de triagem para disfagia",
		category: "Deglutição",
		totalItems: 10
	},
	{
		type: "stopbang",
		name: "STOP-BANG (Apneia do Sono)",
		description: "Triagem para apneia obstrutiva do sono",
		category: "Sono",
		totalItems: 8
	},
	{
		type: "hb",
		name: "House-Brackmann (Paralisia Facial)",
		description: "Classificação da paralisia facial",
		category: "Facial",
		totalItems: 1
	},
	{
		type: "phq9",
		name: "PHQ-9 (Depressão)",
		description: "Questionário de saúde do paciente para depressão",
		category: "Saúde Mental",
		totalItems: 9
	},
	{
		type: "phq44",
		name: "PHQ-4/4 (Ansiedade e Depressão)",
		description: "Triagem rápida de ansiedade e depressão",
		category: "Saúde Mental",
		totalItems: 4
	},
	{
		type: "mdq",
		name: "MDQ (Transtorno Bipolar)",
		description: "Questionário de transtorno do humor",
		category: "Saúde Mental",
		totalItems: 13
	},
	{
		type: "snapiv",
		name: "SNAP-IV (TDAH)",
		description: "Escala de avaliação para TDAH",
		category: "TDAH",
		totalItems: 26
	},
	{
		type: "amisos",
		name: "AMISOS (Autismo)",
		description: "Avaliação de sintomas do espectro autista",
		category: "TEA",
		totalItems: 15
	},
	{
		type: "mdsupdrs",
		name: "MDS-UPDRS (Parkinson)",
		description: "Escala unificada de avaliação da doença de Parkinson",
		category: "Parkinson",
		totalItems: 50
	},
	{
		type: "oddrs",
		name: "ODDRS (Distonia)",
		description: "Escala de avaliação de distonia",
		category: "Neurológica",
		totalItems: 10
	},
	{
		type: "conners",
		name: "Conners (TDAH Infantil)",
		description: "Avaliação de TDAH em crianças",
		category: "TDAH",
		totalItems: 28
	},
	{
		type: "vanderbilt",
		name: "Vanderbilt (TDAH)",
		description: "Escala de avaliação Vanderbilt para TDAH",
		category: "TDAH",
		totalItems: 55
	},
	{
		type: "saliva",
		name: "Escala de Salivação (Parkinson)",
		description: "Avaliação de salivação na doença de Parkinson",
		category: "Parkinson",
		totalItems: 5
	}
];
var CATEGORIES = [...new Set(ALL_SCALES.map((s) => s.category))];
async function loader$7({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$7() {
	return [{ title: "Escalas Clínicas - NeuroLaserMap" }];
}
var escalas_default = UNSAFE_withComponentProps(function EscalasPage() {
	const { user } = useLoaderData();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedScale, setSelectedScale] = useState(null);
	const filteredScales = ALL_SCALES.filter((scale) => {
		const matchesSearch = scale.name.toLowerCase().includes(searchTerm.toLowerCase()) || scale.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = !selectedCategory || scale.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "📊 Escalas Clínicas"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "22 escalas profissionais com cálculos automáticos"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-4",
					children: /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "🔍 Buscar escala...",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2 overflow-x-auto pb-3 mb-4",
					style: { WebkitOverflowScrolling: "touch" },
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setSelectedCategory(null),
						className: `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!selectedCategory ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
						children: [
							"Todas (",
							ALL_SCALES.length,
							")"
						]
					}), CATEGORIES.map((cat) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setSelectedCategory(cat === selectedCategory ? null : cat),
						className: `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
						children: [
							cat,
							" (",
							ALL_SCALES.filter((s) => s.category === cat).length,
							")"
						]
					}, cat))]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: filteredScales.map((scale) => /* @__PURE__ */ jsx("button", {
						onClick: () => setSelectedScale(scale),
						className: "w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.98]",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "font-semibold text-gray-900 text-sm",
										children: scale.name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-gray-500 mt-1",
										children: scale.description
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mt-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium",
											children: scale.category
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs text-gray-400",
											children: [scale.totalItems, " itens"]
										})]
									})
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-gray-400 text-lg ml-2",
								children: "›"
							})]
						})
					}, scale.type))
				}),
				filteredScales.length === 0 && /* @__PURE__ */ jsxs("div", {
					className: "text-center py-12 text-gray-400",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-4xl mb-3",
						children: "🔍"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm",
						children: "Nenhuma escala encontrada"
					})]
				}),
				selectedScale && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center",
					onClick: () => setSelectedScale(null),
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-bold text-gray-900",
								children: selectedScale.name
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSelectedScale(null),
								className: "text-gray-400 hover:text-gray-600 text-2xl",
								children: "×"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-gray-600 mb-4",
									children: selectedScale.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-blue-50 rounded-xl p-4 mb-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium",
											children: selectedScale.category
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs text-gray-500",
											children: [selectedScale.totalItems, " itens"]
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-gray-500",
										children: "Para aplicar esta escala, selecione um paciente e responda todos os itens. O sistema calculará automaticamente o escore e a interpretação."
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
									onClick: () => {
										alert("Funcionalidade de aplicação de escala em desenvolvimento!");
										setSelectedScale(null);
									},
									children: "Aplicar Escala"
								})
							]
						})]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/ciclos.tsx
var ciclos_exports = /* @__PURE__ */ __exportAll({
	default: () => ciclos_default,
	loader: () => loader$6,
	meta: () => meta$6
});
async function loader$6({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$6() {
	return [{ title: "Ciclos Terapêuticos - NeuroLaserMap" }];
}
var ciclos_default = UNSAFE_withComponentProps(function CiclosPage() {
	const { user } = useLoaderData();
	const [showNewCycle, setShowNewCycle] = useState(false);
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "🔄 Ciclos Terapêuticos"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "Gerenciar ciclos de tratamento"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: () => setShowNewCycle(true),
						className: "bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
						children: "+ Novo Ciclo"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-semibold text-blue-800 text-sm mb-1",
						children: "O que são Ciclos Terapêuticos?"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-blue-600",
						children: "Ciclos terapêuticos permitem organizar sessões de tratamento em blocos, facilitando o acompanhamento da evolução do paciente ao longo do tempo."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-center py-16",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-6xl mb-4",
							children: "🔄"
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-gray-900 mb-2",
							children: "Nenhum ciclo cadastrado"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-500 mb-6",
							children: "Crie um novo ciclo terapêutico para começar a organizar as sessões de tratamento."
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setShowNewCycle(true),
							className: "bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
							children: "+ Criar Primeiro Ciclo"
						})
					]
				}),
				showNewCycle && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center",
					onClick: () => setShowNewCycle(false),
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-bold text-gray-900",
								children: "Novo Ciclo Terapêutico"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowNewCycle(false),
								className: "text-gray-400 hover:text-gray-600 text-2xl",
								children: "×"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Nome do Ciclo"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Ex: Ciclo 1 - Reabilitação",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Paciente"
								}), /* @__PURE__ */ jsx("select", {
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white",
									children: /* @__PURE__ */ jsx("option", {
										value: "",
										children: "Selecione um paciente"
									})
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Data Início"
									}), /* @__PURE__ */ jsx("input", {
										type: "date",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Sessões Previstas"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										placeholder: "10",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Observações"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 3,
									placeholder: "Observações sobre o ciclo...",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
								})] }),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
									children: "Criar Ciclo"
								})
							]
						})]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/pacientes.tsx
var pacientes_exports = /* @__PURE__ */ __exportAll({
	default: () => pacientes_default,
	loader: () => loader$5,
	meta: () => meta$5
});
async function loader$5({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$5() {
	return [{ title: "Pacientes - NeuroLaserMap" }];
}
var pacientes_default = UNSAFE_withComponentProps(function PacientesPage() {
	const { user } = useLoaderData();
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddPatient, setShowAddPatient] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "👥 Pacientes"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "Cadastro e gerenciamento"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: () => setShowAddPatient(true),
						className: "bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
						children: "+ Novo"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-4",
					children: /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "🔍 Buscar paciente...",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex gap-2 mb-4",
					children: [
						{
							value: "all",
							label: "Todos"
						},
						{
							value: "active",
							label: "Ativos"
						},
						{
							value: "paused",
							label: "Pausados"
						},
						{
							value: "completed",
							label: "Concluídos"
						}
					].map((f) => /* @__PURE__ */ jsx("button", {
						onClick: () => setStatusFilter(f.value),
						className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
						children: f.label
					}, f.value))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-center py-16",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-6xl mb-4",
							children: "👥"
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-gray-900 mb-2",
							children: "Nenhum paciente cadastrado"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-500 mb-6",
							children: "Cadastre seu primeiro paciente para começar."
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setShowAddPatient(true),
							className: "bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
							children: "+ Cadastrar Primeiro Paciente"
						})
					]
				}),
				showAddPatient && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center",
					onClick: () => setShowAddPatient(false),
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl z-10",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-bold text-gray-900",
								children: "Novo Paciente"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowAddPatient(false),
								className: "text-gray-400 hover:text-gray-600 text-2xl",
								children: "×"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Nome Completo *"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Nome completo",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Data Nascimento"
									}), /* @__PURE__ */ jsx("input", {
										type: "date",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "CPF"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "000.000.000-00",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Telefone"
									}), /* @__PURE__ */ jsx("input", {
										type: "tel",
										placeholder: "(00) 00000-0000",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Email"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										placeholder: "email@exemplo.com",
										className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Endereço"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Endereço completo",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Diagnóstico"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Diagnóstico principal",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Sintomas (0-10)"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									max: "10",
									placeholder: "0",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Notas Médicas"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 3,
									placeholder: "Observações...",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
								})] }),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
									children: "Cadastrar Paciente"
								})
							]
						})]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/nova-sessao.tsx
var nova_sessao_exports = /* @__PURE__ */ __exportAll({
	default: () => nova_sessao_default,
	loader: () => loader$4,
	meta: () => meta$4
});
var EEG_POINTS = [
	"Fp1",
	"Fp2",
	"F7",
	"F3",
	"Fz",
	"F4",
	"F8",
	"T3",
	"C3",
	"Cz",
	"C4",
	"T4",
	"T5",
	"P3",
	"Pz",
	"P4",
	"T6",
	"O1",
	"Oz",
	"O2",
	"A1",
	"A2",
	"Fpz",
	"Nz",
	"Iz"
];
async function loader$4({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$4() {
	return [{ title: "Nova Sessão - NeuroLaserMap" }];
}
var nova_sessao_default = UNSAFE_withComponentProps(function NovaSessaoPage() {
	const { user } = useLoaderData();
	const [selectedPoints, setSelectedPoints] = useState([]);
	const [showPointSelector, setShowPointSelector] = useState(false);
	const [symptomScore, setSymptomScore] = useState(5);
	const togglePoint = (point) => {
		setSelectedPoints((prev) => prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]);
	};
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-gray-900",
					children: "➕ Nova Sessão"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-gray-500 mt-1",
					children: "Registrar nova sessão de tratamento"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Paciente *"
					}), /* @__PURE__ */ jsx("select", {
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white",
						children: /* @__PURE__ */ jsx("option", {
							value: "",
							children: "Selecione um paciente"
						})
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Plano Terapêutico"
					}), /* @__PURE__ */ jsx("select", {
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white",
						children: /* @__PURE__ */ jsx("option", {
							value: "",
							children: "Selecione um plano (opcional)"
						})
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-gray-700 mb-1",
							children: "Data da Sessão *"
						}), /* @__PURE__ */ jsx("input", {
							type: "datetime-local",
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-gray-700 mb-1",
							children: "Duração (min) *"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							placeholder: "30",
							min: "1",
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-gray-700 mb-2",
							children: "Pontos Estimulados (Sistema 10-20)"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setShowPointSelector(!showPointSelector),
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-left hover:border-blue-400 transition-colors",
							children: selectedPoints.length > 0 ? `${selectedPoints.length} ponto(s): ${selectedPoints.join(", ")}` : "Clique para selecionar pontos..."
						}),
						showPointSelector && /* @__PURE__ */ jsxs("div", {
							className: "mt-2 bg-white border border-gray-200 rounded-xl p-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4 text-center",
									children: [/* @__PURE__ */ jsx("img", {
										src: "/images/eeg-10-20-system.jpg",
										alt: "Sistema EEG 10-20",
										className: "max-w-full h-auto rounded-lg mx-auto",
										style: { maxHeight: "300px" }
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-gray-400 mt-1",
										children: "Sistema Internacional 10-20"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-2",
									children: EEG_POINTS.map((point) => /* @__PURE__ */ jsx("button", {
										onClick: () => togglePoint(point),
										className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedPoints.includes(point) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
										children: point
									}, point))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => setSelectedPoints([...EEG_POINTS]),
										className: "text-xs text-blue-600 hover:underline",
										children: "Selecionar Todos"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => setSelectedPoints([]),
										className: "text-xs text-red-500 hover:underline",
										children: "Limpar"
									})]
								})
							]
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Energia (Joules)"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						placeholder: "0",
						min: "0",
						step: "0.1",
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-gray-700 mb-1",
							children: [
								"Avaliação dos Sintomas: ",
								symptomScore,
								"/10"
							]
						}),
						/* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0",
							max: "10",
							value: symptomScore,
							onChange: (e) => setSymptomScore(Number(e.target.value)),
							className: "w-full accent-blue-600"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-xs text-gray-400",
							children: [/* @__PURE__ */ jsx("span", { children: "0 - Sem sintomas" }), /* @__PURE__ */ jsx("span", { children: "10 - Muito grave" })]
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Observações"
					}), /* @__PURE__ */ jsx("textarea", {
						rows: 3,
						placeholder: "Observações sobre a sessão...",
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Reações do Paciente"
					}), /* @__PURE__ */ jsx("textarea", {
						rows: 2,
						placeholder: "Reações observadas...",
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-gray-700 mb-1",
						children: "Próxima Sessão"
					}), /* @__PURE__ */ jsx("input", {
						type: "datetime-local",
						className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
					})] }),
					/* @__PURE__ */ jsx("button", {
						className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98] mt-4",
						children: "Registrar Sessão"
					})
				]
			})]
		})
	});
});
//#endregion
//#region app/routes/efetividade.tsx
var efetividade_exports = /* @__PURE__ */ __exportAll({
	default: () => efetividade_default,
	loader: () => loader$3,
	meta: () => meta$3
});
async function loader$3({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$3() {
	return [{ title: "Efetividade - NeuroLaserMap" }];
}
var efetividade_default = UNSAFE_withComponentProps(function EfetividadePage() {
	const { user } = useLoaderData();
	const [activeTab, setActiveTab] = useState("overview");
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "📈 Efetividade"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "Análise de efetividade do tratamento"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto",
					children: [
						{
							id: "overview",
							label: "Visão Geral",
							icon: "📊"
						},
						{
							id: "comparison",
							label: "Comparação",
							icon: "🔄"
						},
						{
							id: "evolution",
							label: "Evolução",
							icon: "📈"
						},
						{
							id: "statistics",
							label: "Estatísticas",
							icon: "📉"
						}
					].map((tab) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(tab.id),
						className: `flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
						children: [
							tab.icon,
							" ",
							tab.label
						]
					}, tab.id))
				}),
				activeTab === "overview" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-blue-50 border border-blue-200 rounded-xl p-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-blue-800 text-sm mb-2",
							children: "Dashboard de Efetividade"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-blue-600",
							children: "Visualize a efetividade do tratamento. Cadastre pacientes e registre sessões para ver os dados."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "📊"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: "0"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500",
										children: "Sessões Totais"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "📈"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-green-600",
										children: "0%"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500",
										children: "Taxa de Melhora"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "⏱️"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: "0h"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500",
										children: "Tempo Total"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl mb-1",
										children: "🎯"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold text-gray-900",
										children: "0"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-gray-500",
										children: "Pontos Tratados"
									})
								]
							})
						]
					})]
				}),
				activeTab === "comparison" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-green-50 border border-green-200 rounded-xl p-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-green-800 text-sm mb-2",
							children: "Comparação Antes x Depois"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-green-600",
							children: "Compare resultados das escalas antes e depois do tratamento."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-center py-12 text-gray-400",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-4xl mb-3",
							children: "🔄"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: "Registre sessões para ver comparações"
						})]
					})]
				}),
				activeTab === "evolution" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-purple-50 border border-purple-200 rounded-xl p-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-purple-800 text-sm mb-2",
							children: "Evolução dos Sintomas"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-purple-600",
							children: "Acompanhe a evolução dos sintomas ao longo das sessões."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-center py-12 text-gray-400",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-4xl mb-3",
							children: "📈"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: "Registre sessões para ver a evolução"
						})]
					})]
				}),
				activeTab === "statistics" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-orange-50 border border-orange-200 rounded-xl p-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-orange-800 text-sm mb-2",
							children: "Estatísticas Avançadas"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-orange-600",
							children: "Análises estatísticas detalhadas dos resultados."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-center py-12 text-gray-400",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-4xl mb-3",
							children: "📉"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: "Dados insuficientes para estatísticas"
						})]
					})]
				})
			]
		})
	});
});
//#endregion
//#region app/routes/configuracoes.tsx
var configuracoes_exports = /* @__PURE__ */ __exportAll({
	default: () => configuracoes_default,
	loader: () => loader$2,
	meta: () => meta$2
});
async function loader$2({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$2() {
	return [{ title: "Configurações - NeuroLaserMap" }];
}
var configuracoes_default = UNSAFE_withComponentProps(function ConfiguracoesPage() {
	const { user } = useLoaderData();
	const [activeSection, setActiveSection] = useState("general");
	const [darkMode, setDarkMode] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [autoSave, setAutoSave] = useState(true);
	const [language, setLanguage] = useState("pt-BR");
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "⚙️ Configurações"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "Personalizar o aplicativo"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto",
					children: [
						{
							id: "general",
							label: "Geral",
							icon: "⚙️"
						},
						{
							id: "appearance",
							label: "Aparência",
							icon: "🎨"
						},
						{
							id: "notifications",
							label: "Notificações",
							icon: "🔔"
						},
						{
							id: "data",
							label: "Dados",
							icon: "💾"
						},
						{
							id: "about",
							label: "Sobre",
							icon: "ℹ️"
						}
					].map((s) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveSection(s.id),
						className: `flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeSection === s.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
						children: [
							s.icon,
							" ",
							s.label
						]
					}, s.id))
				}),
				activeSection === "general" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-gray-900 text-sm mb-3",
							children: "Idioma"
						}), /* @__PURE__ */ jsxs("select", {
							value: language,
							onChange: (e) => setLanguage(e.target.value),
							className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "pt-BR",
									children: "Português (Brasil)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "en",
									children: "English"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "es",
									children: "Español"
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm",
								children: "Salvamento Automático"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: "Salvar dados automaticamente ao editar"
							})] }), /* @__PURE__ */ jsx("button", {
								onClick: () => setAutoSave(!autoSave),
								className: `w-12 h-6 rounded-full transition-colors ${autoSave ? "bg-blue-600" : "bg-gray-300"}`,
								children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${autoSave ? "translate-x-6" : "translate-x-0.5"}` })
							})]
						})
					})]
				}),
				activeSection === "appearance" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm",
								children: "Modo Escuro"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: "Alternar entre tema claro e escuro"
							})] }), /* @__PURE__ */ jsx("button", {
								onClick: () => setDarkMode(!darkMode),
								className: `w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`,
								children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}` })
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-semibold text-gray-900 text-sm mb-3",
							children: "Tamanho da Fonte"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex gap-2",
							children: [
								"Pequeno",
								"Normal",
								"Grande"
							].map((size) => /* @__PURE__ */ jsx("button", {
								className: `flex-1 px-3 py-2 rounded-lg text-xs font-medium ${size === "Normal" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
								children: size
							}, size))
						})]
					})]
				}),
				activeSection === "notifications" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm",
								children: "Notificações"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: "Receber notificações do sistema"
							})] }), /* @__PURE__ */ jsx("button", {
								onClick: () => setNotifications(!notifications),
								className: `w-12 h-6 rounded-full transition-colors ${notifications ? "bg-blue-600" : "bg-gray-300"}`,
								children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications ? "translate-x-6" : "translate-x-0.5"}` })
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm mb-2",
								children: "Lembretes de Sessão"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mb-3",
								children: "Receber lembrete antes de cada sessão agendada"
							}),
							/* @__PURE__ */ jsxs("select", {
								className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "15",
										children: "15 minutos antes"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "30",
										children: "30 minutos antes"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "60",
										children: "1 hora antes"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "0",
										children: "Desativado"
									})
								]
							})
						]
					})]
				}),
				activeSection === "data" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-gray-900 text-sm mb-2",
									children: "Exportar Dados"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500 mb-3",
									children: "Exportar todos os dados em formato CSV ou JSON"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										className: "flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors",
										children: "Exportar CSV"
									}), /* @__PURE__ */ jsx("button", {
										className: "flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors",
										children: "Exportar JSON"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-gray-900 text-sm mb-2",
									children: "Importar Dados"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500 mb-3",
									children: "Importar dados de um arquivo CSV ou JSON"
								}),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors",
									children: "Selecionar Arquivo"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-red-50 border border-red-200 rounded-xl p-4",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-red-800 text-sm mb-2",
									children: "Zona de Perigo"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-red-600 mb-3",
									children: "Limpar todos os dados locais. Esta ação não pode ser desfeita."
								}),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-red-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors",
									children: "Limpar Dados Locais"
								})
							]
						})
					]
				}),
				activeSection === "about" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-4xl mb-2",
									children: "🧠"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-gray-900 text-lg",
									children: "NeuroLaserMap"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500 mt-1",
									children: "Versão 1.0.0"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400 mt-2",
									children: "Mapeamento de Neuromodulação com Laser de Baixa Intensidade"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm mb-2",
								children: "Desenvolvido por"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500",
								children: "Sistema desenvolvido para profissionais de saúde especializados em neuromodulação."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-gray-900 text-sm mb-2",
								children: "Tecnologias"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-2 mt-2",
								children: [
									"React Router",
									"TypeScript",
									"Tailwind CSS",
									"Node.js",
									"MySQL"
								].map((tech) => /* @__PURE__ */ jsx("span", {
									className: "px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600",
									children: tech
								}, tech))
							})]
						})
					]
				})
			]
		})
	});
});
//#endregion
//#region app/routes/perfil.tsx
var perfil_exports = /* @__PURE__ */ __exportAll({
	default: () => perfil_default,
	loader: () => loader$1,
	meta: () => meta$1
});
async function loader$1({ request }) {
	const { user } = await requireAuth(request);
	return { user };
}
function meta$1() {
	return [{ title: "Perfil - NeuroLaserMap" }];
}
var perfil_default = UNSAFE_withComponentProps(function PerfilPage() {
	const { user } = useLoaderData();
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const accessLevelLabel = (level) => {
		switch (level) {
			case "admin": return "Administrador";
			case "professional": return "Profissional";
			default: return "Usuário";
		}
	};
	const accessLevelColor = (level) => {
		switch (level) {
			case "admin": return "bg-red-100 text-red-700";
			case "professional": return "bg-blue-100 text-blue-700";
			default: return "bg-gray-100 text-gray-700";
		}
	};
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold",
							children: (user.name || user.email)[0].toUpperCase()
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h1", {
								className: "text-xl font-bold",
								children: user.name || "Usuário"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-blue-100 text-sm",
								children: user.email
							}),
							/* @__PURE__ */ jsx("span", {
								className: `inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${accessLevelColor(user.accessLevel)}`,
								children: accessLevelLabel(user.accessLevel)
							})
						] })]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-semibold text-gray-900 text-sm",
							children: "Informações Pessoais"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowEditProfile(true),
							className: "text-blue-600 text-xs font-medium hover:underline",
							children: "Editar"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Email"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-gray-900 text-sm font-medium",
									children: user.email
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Nome"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-gray-900 text-sm font-medium",
									children: user.name || "Não informado"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Nível de Acesso"
								}), /* @__PURE__ */ jsx("span", {
									className: `px-2 py-0.5 rounded-full text-xs font-medium ${accessLevelColor(user.accessLevel)}`,
									children: accessLevelLabel(user.accessLevel)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Status"
								}), /* @__PURE__ */ jsx("span", {
									className: `text-sm font-medium ${user.isApproved ? "text-green-600" : "text-yellow-600"}`,
									children: user.isApproved ? "✅ Aprovado" : "⏳ Aguardando aprovação"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-semibold text-gray-900 text-sm mb-3",
						children: "Dados Profissionais"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Registro Profissional"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-gray-900 text-sm font-medium",
									children: user.professionalRegistration || "Não informado"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Especialidade"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-gray-900 text-sm font-medium",
									children: user.specialty || "Não informado"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center py-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-gray-500 text-xs",
									children: "Instituição"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-gray-900 text-sm font-medium",
									children: user.institution || "Não informado"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-semibold text-gray-900 text-sm mb-3",
						children: "Segurança"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setShowChangePassword(true),
						className: "w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-3 text-left transition-colors",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-medium text-gray-900 text-sm",
							children: "🔒 Alterar Senha"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-gray-500 mt-0.5",
							children: "Mude sua senha de acesso"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-semibold text-gray-900 text-sm mb-3",
						children: "Dados"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs("button", {
							className: "w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-3 text-left transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium text-gray-900 text-sm",
								children: "💾 Fazer Backup"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: "Exporte todos os seus dados"
							})]
						}), /* @__PURE__ */ jsxs("button", {
							className: "w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-3 text-left transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium text-gray-900 text-sm",
								children: "📊 Relatório Completo"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: "Gere um relatório de todas as sessões"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-red-200 rounded-xl p-4 shadow-sm mb-20",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-semibold text-red-700 text-sm mb-3",
						children: "Conta"
					}), /* @__PURE__ */ jsx(Form, {
						method: "post",
						action: "/logout",
						children: /* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-3 text-left transition-colors",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium text-red-700 text-sm",
								children: "🚪 Sair da Conta"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-red-500 mt-0.5",
								children: "Encerrar sessão e voltar ao login"
							})]
						})
					})]
				}),
				showEditProfile && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center",
					onClick: () => setShowEditProfile(false),
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-bold text-gray-900",
								children: "Editar Perfil"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowEditProfile(false),
								className: "text-gray-400 hover:text-gray-600 text-2xl",
								children: "×"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Nome"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									defaultValue: user.name || "",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Registro Profissional"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									defaultValue: user.professionalRegistration || "",
									placeholder: "CRM, CRF, etc.",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Especialidade"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									defaultValue: user.specialty || "",
									placeholder: "Ex: Neurologia",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Instituição"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									defaultValue: user.institution || "",
									placeholder: "Ex: Hospital X",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
									children: "Salvar Alterações"
								})
							]
						})]
					})
				}),
				showChangePassword && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center",
					onClick: () => setShowChangePassword(false),
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ jsxs("div", {
							className: "sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-bold text-gray-900",
								children: "Alterar Senha"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowChangePassword(false),
								className: "text-gray-400 hover:text-gray-600 text-2xl",
								children: "×"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Senha Atual"
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Nova Senha"
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Confirmar Nova Senha"
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								})] }),
								/* @__PURE__ */ jsx("button", {
									className: "w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]",
									children: "Alterar Senha"
								})
							]
						})]
					})
				})
			]
		})
	});
});
//#endregion
//#region app/routes/admin.tsx
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => admin_default,
	loader: () => loader,
	meta: () => meta
});
async function loader({ request }) {
	const { user, token } = await requireAuth(request);
	if (user.accessLevel !== "admin") throw new Response("Acesso negado", { status: 403 });
	let users = [];
	try {
		users = await apiGetUsers(token);
	} catch (e) {
		console.error("Failed to fetch users:", e);
	}
	return {
		user,
		users,
		token
	};
}
function meta() {
	return [{ title: "Admin - NeuroLaserMap" }];
}
var admin_default = UNSAFE_withComponentProps(function AdminPage() {
	const { user, users: initialUsers, token } = useLoaderData();
	const [users, setUsers] = useState(initialUsers);
	const [activeTab, setActiveTab] = useState("pending");
	const [loading, setLoading] = useState(null);
	const [message, setMessage] = useState(null);
	const pendingUsers = users.filter((u) => !u.isApproved);
	const approvedUsers = users.filter((u) => u.isApproved);
	const handleApprove = async (email) => {
		setLoading(email);
		setMessage(null);
		try {
			if ((await fetch("/api/admin-action", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "approve",
					email,
					token
				})
			})).ok) {
				setUsers((prev) => prev.map((u) => u.email === email ? {
					...u,
					isApproved: true
				} : u));
				setMessage({
					type: "success",
					text: `Usuário ${email} aprovado com sucesso!`
				});
			} else setMessage({
				type: "error",
				text: "Erro ao aprovar usuário"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "Erro de conexão"
			});
		}
		setLoading(null);
	};
	const handleReject = async (email) => {
		if (!confirm("Tem certeza que deseja rejeitar este usuário?")) return;
		setLoading(email);
		setMessage(null);
		try {
			if ((await fetch("/api/admin-action", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "reject",
					email,
					token
				})
			})).ok) {
				setUsers((prev) => prev.filter((u) => u.email !== email));
				setMessage({
					type: "success",
					text: `Usuário ${email} rejeitado.`
				});
			} else setMessage({
				type: "error",
				text: "Erro ao rejeitar usuário"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "Erro de conexão"
			});
		}
		setLoading(null);
	};
	const accessLevelLabel = (level) => {
		switch (level) {
			case "admin": return "Admin";
			case "professional": return "Profissional";
			default: return "Usuário";
		}
	};
	const accessLevelColor = (level) => {
		switch (level) {
			case "admin": return "bg-red-100 text-red-700";
			case "professional": return "bg-blue-100 text-blue-700";
			default: return "bg-gray-100 text-gray-700";
		}
	};
	return /* @__PURE__ */ jsx(AppLayout, {
		userName: user.name,
		userRole: user.accessLevel,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-gray-900",
						children: "🔐 Painel Admin"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-gray-500 mt-1",
						children: "Gerenciamento de usuários e sistema"
					})]
				}),
				message && /* @__PURE__ */ jsx("div", {
					className: `mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`,
					children: message.text
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-3 gap-3 mb-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-2xl font-bold text-gray-900",
								children: users.length
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-gray-500",
								children: "Total"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-2xl font-bold text-green-600",
								children: approvedUsers.length
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-gray-500",
								children: "Aprovados"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-2xl font-bold text-yellow-600",
								children: pendingUsers.length
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-gray-500",
								children: "Pendentes"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-1 bg-gray-100 rounded-xl p-1 mb-6",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab("pending"),
						className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "pending" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`,
						children: [
							"Pendentes (",
							pendingUsers.length,
							")"
						]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab("approved"),
						className: `flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "approved" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`,
						children: [
							"Aprovados (",
							approvedUsers.length,
							")"
						]
					})]
				}),
				activeTab === "pending" && /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: pendingUsers.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "text-center py-12 text-gray-400",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-4xl mb-3",
							children: "✅"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: "Nenhum usuário pendente"
						})]
					}) : pendingUsers.map((u) => /* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-yellow-200 rounded-xl p-4 shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-gray-900 text-sm",
									children: u.name || u.email
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500",
									children: u.email
								}),
								u.professionalRegistration && /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-gray-400 mt-1",
									children: ["Reg: ", u.professionalRegistration]
								}),
								u.specialty && /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-gray-400",
									children: ["Esp: ", u.specialty]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-gray-400 mt-1",
									children: ["Cadastro: ", new Date(u.createdAt).toLocaleDateString("pt-BR")]
								})
							] }), /* @__PURE__ */ jsx("span", {
								className: "px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium",
								children: "Pendente"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2 mt-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => handleApprove(u.email),
								disabled: loading === u.email,
								className: "flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50",
								children: loading === u.email ? "..." : "✅ Aprovar"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => handleReject(u.email),
								disabled: loading === u.email,
								className: "flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50",
								children: loading === u.email ? "..." : "❌ Rejeitar"
							})]
						})]
					}, u.email))
				}),
				activeTab === "approved" && /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: approvedUsers.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "text-center py-12 text-gray-400",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-4xl mb-3",
							children: "👥"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: "Nenhum usuário aprovado"
						})]
					}) : approvedUsers.map((u) => /* @__PURE__ */ jsx("div", {
						className: "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-gray-900 text-sm",
									children: u.name || u.email
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-500",
									children: u.email
								}),
								u.specialty && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-gray-400 mt-1",
									children: u.specialty
								})
							] }), /* @__PURE__ */ jsx("span", {
								className: `px-2 py-0.5 rounded-full text-xs font-medium ${accessLevelColor(u.accessLevel)}`,
								children: accessLevelLabel(u.accessLevel)
							})]
						})
					}, u.email))
				})
			]
		})
	});
});
//#endregion
//#region app/routes/api.admin-action.tsx
var api_admin_action_exports = /* @__PURE__ */ __exportAll({ action: () => action });
async function action({ request }) {
	const { action: adminAction, email, token } = await request.json();
	try {
		if (adminAction === "approve") {
			await apiApproveUser(token, email);
			return Response.json({ success: true });
		} else if (adminAction === "reject") {
			await apiRejectUser(token, email);
			return Response.json({ success: true });
		}
		return Response.json({ error: "Invalid action" }, { status: 400 });
	} catch (e) {
		return Response.json({ error: e.message }, { status: 500 });
	}
}
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/api/webapp/assets/entry.client-DQM68nXx.js",
		"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/api/webapp/assets/root-G8cMl8u4.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js"],
			"css": ["/api/webapp/assets/root-BAPD8kmz.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/home-CHB8Jihr.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/login": {
			"id": "routes/login",
			"parentId": "root",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/login-CKGR2HXZ.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/register": {
			"id": "routes/register",
			"parentId": "root",
			"path": "register",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/register-BmHWpAf0.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/logout": {
			"id": "routes/logout",
			"parentId": "root",
			"path": "logout",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/logout-Cj3Hn5f5.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/escalas": {
			"id": "routes/escalas",
			"parentId": "root",
			"path": "escalas",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/escalas-r0zRp3_u.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/ciclos": {
			"id": "routes/ciclos",
			"parentId": "root",
			"path": "ciclos",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/ciclos-DVSLJnvf.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/pacientes": {
			"id": "routes/pacientes",
			"parentId": "root",
			"path": "pacientes",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/pacientes-A1rNZYHO.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/nova-sessao": {
			"id": "routes/nova-sessao",
			"parentId": "root",
			"path": "nova-sessao",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/nova-sessao-BRK1X3nA.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/efetividade": {
			"id": "routes/efetividade",
			"parentId": "root",
			"path": "efetividade",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/efetividade-30mrpnK-.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/configuracoes": {
			"id": "routes/configuracoes",
			"parentId": "root",
			"path": "configuracoes",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/configuracoes-Db5CL8NG.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/perfil": {
			"id": "routes/perfil",
			"parentId": "root",
			"path": "perfil",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/perfil-eJJaY1sW.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin": {
			"id": "routes/admin",
			"parentId": "root",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/admin-DX5QNAev.js",
			"imports": ["/api/webapp/assets/jsx-runtime-BKFSLZQ1.js", "/api/webapp/assets/app-layout-Bjxzt_Lv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/api.admin-action": {
			"id": "routes/api.admin-action",
			"parentId": "root",
			"path": "api/admin-action",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/api/webapp/assets/api.admin-action-DrKJofUs.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/api/webapp/assets/manifest-a0722512.js",
	"version": "a0722512",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/api/webapp";
var future = {
	"unstable_optimizeDeps": false,
	"unstable_passThroughRequests": false,
	"unstable_subResourceIntegrity": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/api/webapp/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/login": {
		id: "routes/login",
		parentId: "root",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"routes/register": {
		id: "routes/register",
		parentId: "root",
		path: "register",
		index: void 0,
		caseSensitive: void 0,
		module: register_exports
	},
	"routes/logout": {
		id: "routes/logout",
		parentId: "root",
		path: "logout",
		index: void 0,
		caseSensitive: void 0,
		module: logout_exports
	},
	"routes/escalas": {
		id: "routes/escalas",
		parentId: "root",
		path: "escalas",
		index: void 0,
		caseSensitive: void 0,
		module: escalas_exports
	},
	"routes/ciclos": {
		id: "routes/ciclos",
		parentId: "root",
		path: "ciclos",
		index: void 0,
		caseSensitive: void 0,
		module: ciclos_exports
	},
	"routes/pacientes": {
		id: "routes/pacientes",
		parentId: "root",
		path: "pacientes",
		index: void 0,
		caseSensitive: void 0,
		module: pacientes_exports
	},
	"routes/nova-sessao": {
		id: "routes/nova-sessao",
		parentId: "root",
		path: "nova-sessao",
		index: void 0,
		caseSensitive: void 0,
		module: nova_sessao_exports
	},
	"routes/efetividade": {
		id: "routes/efetividade",
		parentId: "root",
		path: "efetividade",
		index: void 0,
		caseSensitive: void 0,
		module: efetividade_exports
	},
	"routes/configuracoes": {
		id: "routes/configuracoes",
		parentId: "root",
		path: "configuracoes",
		index: void 0,
		caseSensitive: void 0,
		module: configuracoes_exports
	},
	"routes/perfil": {
		id: "routes/perfil",
		parentId: "root",
		path: "perfil",
		index: void 0,
		caseSensitive: void 0,
		module: perfil_exports
	},
	"routes/admin": {
		id: "routes/admin",
		parentId: "root",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: admin_exports
	},
	"routes/api.admin-action": {
		id: "routes/api.admin-action",
		parentId: "root",
		path: "api/admin-action",
		index: void 0,
		caseSensitive: void 0,
		module: api_admin_action_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };

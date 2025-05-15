--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-15 01:02:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    senha character varying(100) NOT NULL,
    email character varying(255),
    token_recuperacao text,
    token_expira_em timestamp without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4796 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4641 (class 2604 OID 16393)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4790 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, username, senha, email, token_recuperacao, token_expira_em) FROM stdin;
1	teste	1234	teste@email.com	\N	\N
2	teste	1234	teste2@email.com	\N	\N
3	Maria	123456	maria@email.com	\N	\N
11	irineu	$2b$10$8VHxn.nNddrbjdWzgFUcw.u6wtAJOMMcyQ8t.KpKZ1Y6FYo6OApnu	irineu@email.com	\N	\N
12	Italo	$2b$10$tCgzpaSSv6wM5P2kagIKq.KwGbD8hIop4ZikF9w6IPwfaFLKKIS3S	Italo@12345	\N	\N
13	Italo	$2b$10$6rEdifkOy7rfFt2gQRivLOGnQYkaBSSLZu7iCFC8UeXOYw8V5ek9C	Italo@12345	\N	\N
14	Italo	$2b$10$wdJIUgQGnkjcc/6QWWfi9uiTUTk2N1CrY08HqFakYfzDymtSP1pye	Italo@12345	\N	\N
16	Italo	$2b$10$IgkYQnqof4iWfJm1q1FSluTYzmiCibplr9wIQ8TuWrI.EtKR9RR1K	Italo@434	\N	\N
20	Italo	$2b$10$JWmgEGVmx6tztNZycuRln.s/k4A5FPTO7D9nI7ccukbmBRSV1Mmr.	Italojose957@gmail.com	d73319	2025-05-15 00:44:46.292
15	Italo	$2b$10$pHr6F1gTfo9gtJeYCFeoJ.uiGmIZ02YiBqew/NUBWrOUkWqPg7VHy	Italo@123	7ba548	2025-05-15 00:46:22.467
17	Italo	$2b$10$6yg2XzwE4wcaxLeuQ1RV6u31Md1BK3IVFLrgAWsfOs3fmhmiHlzmW	Italo@123	7ba548	2025-05-15 00:46:22.467
18	Italo	$2b$10$mZqiTsLKLOH979yE8sHC/er2.KyGOY.4.OTALz36uHR6bCm.ljvO2	Italo@123	7ba548	2025-05-15 00:46:22.467
19	Italo	$2b$10$ZXZUpOJnTZTnvyG4qNpTmeATQT6FSyKWQZszNJxRdZF82zqhsrorO	Italo@123	7ba548	2025-05-15 00:46:22.467
\.


--
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 20, true);


--
-- TOC entry 4643 (class 2606 OID 16395)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


-- Completed on 2025-05-15 01:02:58

--
-- PostgreSQL database dump complete
--


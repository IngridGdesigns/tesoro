--
-- PostgreSQL database dump
--Tables only, data had account number from Auth0
--

-- Dumped from database version 16.2 (Postgres.app)
-- Dumped by pg_dump version 16.2 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: transaction_category; Type: TYPE; Schema: public; Owner: ingridg
--

CREATE TYPE public.transaction_category AS ENUM (
    'saving',
    'income',
    'expense'
);


ALTER TYPE public.transaction_category OWNER TO ingridg;

--
-- Name: insert_into_income_expenses_savings(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.insert_into_income_expenses_savings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.type = 'income' THEN
        INSERT INTO income (user_id, amount, description, date)
        VALUES (NEW.user_id, NEW.amount, NEW.description, NEW.created_at);
    ELSIF NEW.type = 'expense' THEN
        INSERT INTO expenses (user_id, amount, category_id, description, date)
        VALUES (NEW.user_id, NEW.amount, NEW.category_id, NEW.description, NEW.created_at);
    ELSIF NEW.type = 'saving' THEN
        INSERT INTO savings (user_id, amount, description, date)
        VALUES (NEW.user_id, NEW.amount, NEW.description, NEW.created_at);
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.insert_into_income_expenses_savings() OWNER TO ingridg;

--
-- Name: update_budget_after_expenses_insert(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_budget_after_expenses_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE budget
    SET total_expenses = (SELECT SUM(amount) FROM expenses WHERE user_id = NEW.user_id),
        remaining_cashflow = (SELECT SUM(amount) FROM income WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM expenses WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM savings WHERE user_id = NEW.user_id)
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_budget_after_expenses_insert() OWNER TO ingridg;

--
-- Name: update_budget_after_income_insert(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_budget_after_income_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE budget
    SET total_income = (SELECT SUM(amount) FROM income WHERE user_id = NEW.user_id),
        remaining_cashflow = (SELECT SUM(amount) FROM income WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM expenses WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM savings WHERE user_id = NEW.user_id)
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_budget_after_income_insert() OWNER TO ingridg;

--
-- Name: update_budget_after_savings_insert(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_budget_after_savings_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE budget
    SET total_savings = (SELECT SUM(amount) FROM savings WHERE user_id = NEW.user_id),
        remaining_cashflow = (SELECT SUM(amount) FROM income WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM expenses WHERE user_id = NEW.user_id) - (SELECT SUM(amount) FROM savings WHERE user_id = NEW.user_id)
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_budget_after_savings_insert() OWNER TO ingridg;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO ingridg;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: budget; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.budget (
    budget_id integer NOT NULL,
    budget_name character varying(100),
    user_id integer,
    budget_amount numeric(10,2) NOT NULL,
    description text,
    start_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_income numeric(10,2),
    total_expenses numeric(10,2),
    total_savings numeric(10,2),
    remaining_cashflow numeric(10,2)
);


ALTER TABLE public.budget OWNER TO ingridg;

--
-- Name: budget_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.budget_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_budget_id_seq OWNER TO ingridg;

--
-- Name: budget_budget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.budget_budget_id_seq OWNED BY public.budget.budget_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(200),
    icon text DEFAULT '<FontAwesomeIcon icon="fa-solid fa-money-bill-1-wave" />'::text
);


ALTER TABLE public.categories OWNER TO ingridg;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO ingridg;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    category_id integer,
    description text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.expenses OWNER TO ingridg;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_expense_id_seq OWNER TO ingridg;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;


--
-- Name: financial_goals; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.financial_goals (
    goals_id integer NOT NULL,
    user_id integer,
    goal_name character varying(100) NOT NULL,
    target_amount numeric(10,2) NOT NULL,
    current_amount numeric(10,2) DEFAULT 0,
    goal_type character varying(20) DEFAULT 'Savings'::character varying NOT NULL,
    term character varying(40),
    target_date date,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financial_goals OWNER TO ingridg;

--
-- Name: financial_goals_goals_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.financial_goals_goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_goals_goals_id_seq OWNER TO ingridg;

--
-- Name: financial_goals_goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.financial_goals_goals_id_seq OWNED BY public.financial_goals.goals_id;


--
-- Name: income; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.income (
    income_id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    description text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.income OWNER TO ingridg;

--
-- Name: income_income_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.income_income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.income_income_id_seq OWNER TO ingridg;

--
-- Name: income_income_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.income_income_id_seq OWNED BY public.income.income_id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    user_id integer,
    report_name character varying(100) NOT NULL,
    insights_text text,
    date_generated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO ingridg;

--
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO ingridg;

--
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- Name: savings; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.savings (
    saving_id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    description text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.savings OWNER TO ingridg;

--
-- Name: savings_saving_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.savings_saving_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.savings_saving_id_seq OWNER TO ingridg;

--
-- Name: savings_saving_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.savings_saving_id_seq OWNED BY public.savings.saving_id;


--
-- Name: statistics; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.statistics (
    statistic_id integer NOT NULL,
    user_id integer NOT NULL,
    category character varying(20) NOT NULL,
    metric character varying(50) NOT NULL,
    value numeric(10,2) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.statistics OWNER TO ingridg;

--
-- Name: statistics_statistic_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.statistics_statistic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statistics_statistic_id_seq OWNER TO ingridg;

--
-- Name: statistics_statistic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.statistics_statistic_id_seq OWNED BY public.statistics.statistic_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    user_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    type public.transaction_category NOT NULL,
    description text,
    category_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO ingridg;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_transaction_id_seq OWNER TO ingridg;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(30),
    registration_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean
);


ALTER TABLE public.users OWNER TO ingridg;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO ingridg;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: budget budget_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget ALTER COLUMN budget_id SET DEFAULT nextval('public.budget_budget_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: expenses expense_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);


--
-- Name: financial_goals goals_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.financial_goals ALTER COLUMN goals_id SET DEFAULT nextval('public.financial_goals_goals_id_seq'::regclass);


--
-- Name: income income_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.income ALTER COLUMN income_id SET DEFAULT nextval('public.income_income_id_seq'::regclass);


--
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- Name: savings saving_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.savings ALTER COLUMN saving_id SET DEFAULT nextval('public.savings_saving_id_seq'::regclass);


--
-- Name: statistics statistic_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.statistics ALTER COLUMN statistic_id SET DEFAULT nextval('public.statistics_statistic_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (budget_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: financial_goals financial_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.financial_goals
    ADD CONSTRAINT financial_goals_pkey PRIMARY KEY (goals_id);


--
-- Name: income income_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (income_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- Name: savings savings_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.savings
    ADD CONSTRAINT savings_pkey PRIMARY KEY (saving_id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (statistic_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: expenses expenses_insert_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER expenses_insert_trigger AFTER INSERT ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_budget_after_expenses_insert();


--
-- Name: income income_insert_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER income_insert_trigger AFTER INSERT ON public.income FOR EACH ROW EXECUTE FUNCTION public.update_budget_after_income_insert();


--
-- Name: transactions insert_into_income_expenses_savings_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER insert_into_income_expenses_savings_trigger AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.insert_into_income_expenses_savings();


--
-- Name: savings savings_insert_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER savings_insert_trigger AFTER INSERT ON public.savings FOR EACH ROW EXECUTE FUNCTION public.update_budget_after_savings_insert();


--
-- Name: transactions update_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER update_updated_at_trigger BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: budget budget_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: income income_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: transactions user_id; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--


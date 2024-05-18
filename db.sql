--
-- PostgreSQL database dump
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
-- Name: update_budget_and_goals(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_budget_and_goals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
--    v_total_income NUMERIC;
--    v_total_expenses NUMERIC;
--    v_total_savings NUMERIC;
--    v_remaining_cashflow NUMERIC;
--    v_user_budget_amount NUMERIC;
BEGIN
--    -- Fetch budget amount for the user
--    SELECT budget_amount INTO v_user_budget_amount
--    FROM budget
--    WHERE user_id = NEW.user_id;
--
--    -- Calculate total income including account balances
--    SELECT COALESCE(SUM(amount), 0) + COALESCE(SUM(balance), 0) INTO v_total_income
--    FROM transactions
--    LEFT JOIN accounts ON transactions.account_id = accounts.account_id
--    WHERE transactions.user_id = NEW.user_id AND transactions.amount > 0;
--
    -- Calculate total expenses
--    SELECT COALESCE(SUM(amount), 0) INTO v_total_expenses
--    FROM transactions
--    WHERE user_id = NEW.user_id AND amount < 0;

--    -- Calculate total savings
----    v_total_savings := v_total_income - v_total_expenses;
--  
--
--    -- Calculate remaining cashflow
--    v_remaining_cashflow := v_user_budget_amount - v_total_expenses;
--
--    -- Update budget table
--    UPDATE budget
--    SET total_expenses = v_total_expenses
--total_income = v_total_income,
--        total_savings = v_total_savings,
--        remaining_cashflow = v_remaining_cashflow
--    WHERE user_id = NEW.user_id;

    -- Update financial goals table if transaction contributes to a goal
    IF NEW.goal_id IS NOT NULL THEN
        -- Update current amount towards the goal
        UPDATE financial_goals
        SET remaining_amount = goal_amount - (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE goal_id = NEW.goal_id)
        WHERE goal_id = NEW.goal_id;
        
        -- Update remaining amount towards the goal
        UPDATE financial_goals
        SET current_amount = goal_amount - remaining_amount
        WHERE goal_id = NEW.goal_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_budget_and_goals() OWNER TO ingridg;

--
-- Name: update_goals(); Type: FUNCTION; Schema: public; Owner: ingridg
--

CREATE FUNCTION public.update_goals() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
--    v_total_expenses NUMERIC;
--
BEGIN
    -- Calculate total expenses
--    SELECT COALESCE(SUM(amount), 0) INTO v_total_expenses
--    FROM transactions
--    WHERE user_id = NEW.user_id AND amount < 0;
--
----    -- Update budget table
--    UPDATE budget
--    SET total_expenses = v_total_expenses
--    WHERE user_id = NEW.user_id;
--
    -- Update financial goals table if transaction contributes to a goal
    IF NEW.goal_id IS NOT NULL THEN
        -- Update current amount towards the goal
        UPDATE financial_goals
        SET remaining_amount = goal_amount - (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE goal_id = NEW.goal_id)
        WHERE goal_id = NEW.goal_id;
        
        -- Update remaining amount towards the goal
        UPDATE financial_goals
        SET current_amount = goal_amount - remaining_amount
        WHERE goal_id = NEW.goal_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_goals() OWNER TO ingridg;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    user_id integer NOT NULL,
    account_name_info character varying(255),
    balance numeric(10,2),
    user_sub character varying(100)
);


ALTER TABLE public.accounts OWNER TO ingridg;

--
-- Name: accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.accounts_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_account_id_seq OWNER TO ingridg;

--
-- Name: accounts_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.accounts_account_id_seq OWNED BY public.accounts.account_id;


--
-- Name: budget; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.budget (
    budget_id integer NOT NULL,
    user_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    start_date timestamp without time zone DEFAULT CURRENT_DATE,
    updated_at timestamp without time zone DEFAULT CURRENT_DATE,
    category_id integer,
    user_sub character varying(100)
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
    category_name character varying(255) NOT NULL,
    description character varying(200)
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

-- INSERT INTO categories (category_name, description) VALUES
--     ('Rent', 'monthly house or rent payments'),
--     ('Utilities', 'water, gas, electricity, cellphone, garbage'),
--     ('Transportation', 'gas, car insurance, public transportation, taxi'),
--     ('Food', 'groceries, restaurant outings, snacks'),
--     ('Healthcare and Wellness', 'hospital bills, eye exams, dental cleanings'),
--     ('Savings', 'savings for retirement, travel, future expenses'),
--     ('Recreation and Entertainment', 'guitar lessons, hulu/netflix, gaming, camping, theme parks, salsa dancing'),
--     ('Lending $ to family & friends', 'giving for Quinceañera, abuela food costs, help pay cousin school loans'),
--     ('Education', 'online learning, conferences, book costs, tuition fees'),
--     ('Debt Payments', 'credit card, school debt, paying back mamá'),
--     ('Personal Spending', 'manicure, massage, new clothes, shoes'),
--     ('Miscellaneous', 'getting money back from friends, new rug, kitchen silverware, detergent, broom'),
--     ('Café', 'coffee, tea, smoothie at cafes, include pastries here too');


--
-- Name: financial_goals; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.financial_goals (
    goal_id integer NOT NULL,
    user_id integer NOT NULL,
    goal_name character varying(255),
    goal_amount numeric(10,2),
    target_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    current_amount numeric(10,2),
    remaining_amount numeric(10,2),
    user_sub character varying(100)
);


ALTER TABLE public.financial_goals OWNER TO ingridg;

--
-- Name: financial_goals_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: ingridg
--

CREATE SEQUENCE public.financial_goals_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_goals_goal_id_seq OWNER TO ingridg;

--
-- Name: financial_goals_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ingridg
--

ALTER SEQUENCE public.financial_goals_goal_id_seq OWNED BY public.financial_goals.goal_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: ingridg
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    user_id integer NOT NULL,
    account_id integer,
    description text,
    category_id integer,
    amount numeric(10,2),
    transaction_date date DEFAULT CURRENT_DATE NOT NULL,
    goal_id integer,
    user_sub character varying(100)
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
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(50) NOT NULL,
    role character varying(8) DEFAULT 'user'::character varying,
    user_sub character varying(100)
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
-- Name: accounts account_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.accounts ALTER COLUMN account_id SET DEFAULT nextval('public.accounts_account_id_seq'::regclass);


--
-- Name: budget budget_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget ALTER COLUMN budget_id SET DEFAULT nextval('public.budget_budget_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: financial_goals goal_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.financial_goals ALTER COLUMN goal_id SET DEFAULT nextval('public.financial_goals_goal_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (budget_id);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: financial_goals financial_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.financial_goals
    ADD CONSTRAINT financial_goals_pkey PRIMARY KEY (goal_id);


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
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: transactions update_budget_trigger; Type: TRIGGER; Schema: public; Owner: ingridg
--

CREATE TRIGGER update_budget_trigger AFTER INSERT OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_budget_and_goals();


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE;


--
-- Name: budget budget_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: budget budget_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE;


--
-- Name: financial_goals financial_goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.financial_goals
    ADD CONSTRAINT financial_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: transactions transactions_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.financial_goals(goal_id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ingridg
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--


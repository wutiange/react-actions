# react-actions

Language: [中文](./language/zh-README.md) | English

In a React project, if you only want to control refresh operations and other actions through behaviors, then this simple library is a great choice.

## 1. Background
In state management libraries like Redux, Zustand, and MobX, we often need to write various states and actions to manage our applications. However, in my actual development experience, I found that in most cases, we don't actually need these libraries. We only use them because they are widely adopted. Even if we do use them, we end up storing almost all of our data in them, causing our application's memory usage to keep growing over time. Most of the data doesn't actually need to be stored because we always fetch the latest data with each operation and replace the previous data. However, we don't delete the data outside of the components, resulting in an accumulation of data over time.

## 2. My Solution
Since most of our application doesn't require state management, I thought about how to handle the problem of refreshing multiple pages based on behaviors instead of states. That's when I came up with the idea of behavior-driven development and developed react-actions.

## 3. Installation
```bash
npm install @wutiange/react-actions
```
If you're using Yarn, then run:
```bash
yarn add @wutiange/react-actions
```

## 4. Usage
### 4.1 Create Two Behaviors
It's very easy to use. First, define two behaviors: `useSubscribe` and `useAction`. They respectively mean "subscribe" and "trigger." Subscribing is done where you want the data to be refreshed, and triggering is done elsewhere.
```js
export const { useSubscribe, useAction } = create();
```
You can create multiple behaviors in the actual usage based on your business needs.

### 4.2 Subscribe
If you have a page that modifies data and you want the associated data to be refreshed, the first thing you need to do is subscribe at the location where data refreshing is needed. Subscribing is simple:
```js
// First, import
const subscribe = useSubscribe();

// Then, subscribe
subscribe("text", setText);
```
Here, `setText` is the action you want to handle. It will be called when triggered from another page.

### 4.3 Trigger
Once the subscription is completed, you can trigger it from elsewhere.
```js
// First, import
const trigger = useAction((actions) => actions["text"]);

// Then, trigger
trigger("Hello, I'm developer Wu Jingyue");
```

## 5. Example
To see the effect for yourself, run the example and test it out.
```bash
cd example

yarn

yarn start
```
This will open the example interface in your browser.

## 6. Plans
I will fully utilize `react-actions` in our own project to evaluate its pros and cons and address any issues that arise. So far, there haven't been any problems.

Feel free to give it a try if you come across it, and if you encounter any issues, please open an issue, and I will address it accordingly.
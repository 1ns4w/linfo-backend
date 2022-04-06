/* another way to approach lazy loading is iteratively increasing scrollY until
it reaches the current scroll height, then make a pause and if there's more content
keep up the autoscroll */

export const loadPageContent = async (loadingDelaySeconds = 3) => {
    while (true) {
        let previousScrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({top: previousScrollHeight, behavior: "smooth"});
        await new Promise(r => setTimeout(r, loadingDelaySeconds * 1000));
        if (previousScrollHeight === document.documentElement.scrollHeight) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            await new Promise(r => setTimeout(r, 1000));
            break
        }
    }
}
const filters = document.querySelectorAll(".filter");

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.getAttribute("data-filter");

        // Navigate to the listings page with the category filter
        window.location.href = `/listings?category=${encodeURIComponent(category)}`;
    });
});

// Highlight active filter based on URL
const urlParams = new URLSearchParams(window.location.search);

const activeCategory = urlParams.get('category');


if (activeCategory) {
    filters.forEach(filter => {
        if (filter.getAttribute('data-filter') === activeCategory) {
            filter.style.opacity = '1';
            filter.style.borderBottom = '3px solid #fe424b';
            filter.style.borderRadius = '3px';
        }
    });
}




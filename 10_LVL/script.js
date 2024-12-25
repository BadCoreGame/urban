document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const loadingMessage = document.getElementById('loading-message');
    const addProductForm = document.getElementById('add-product-form');
    const categoryFilter = document.getElementById('category-filter');

    let currentPage = 1;
    let selectedCategory = '';

    //логика получения данных с api 
    const fetchProducts = async (page = 1, category = '') => {
        try {
            const url = category
                ? `https://fakestoreapi.com/products/category/${category}?limit=6&page=${page}`
                : `https://fakestoreapi.com/products?limit=6&page=${page}`;
            const response = await fetch(url);
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
        }
    };
    //вывод товаров на страницу
    const renderProducts = (products) => {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id; // Добавляем data-id для идентификации карточки
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.price} $</p>
                <p>${product.description}</p>
                <button onclick="deleteProduct(${product.id})">Удалить товар</button>
            `;
            productList.appendChild(productCard);
        });
    };
    //загрузка продуктов через api
    const loadProducts = async () => {
        loadingMessage.style.display = 'block';
        loadMoreButton.style.display = 'none';
        const products = await fetchProducts(currentPage, selectedCategory);
        renderProducts(products);
        currentPage++;
        loadingMessage.style.display = 'none';
        loadMoreButton.style.display = 'block';
    };
    //загрузка категорий через api
    const loadCategories = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
        }
    };
    //добавление продукта
    const addProduct = async (product) => {
        try {
            const response = await fetch('https://fakestoreapi.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            const newProduct = await response.json();
            alert('Товар успешно добавлен!');
            loadProducts();
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
        }
    };
    //удаление продукта и его карточки
    window.deleteProduct = async (productId) => {
        try {
            await fetch(`https://fakestoreapi.com/products/${productId}`, {
                method: 'DELETE'
            });
            alert('Товар успешно удален!');
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {
                productCard.remove();
            }
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };
    //обработка формы добавления товара
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const product = { title, price, description, category };
        addProduct(product);
        addProductForm.reset();
    });
    
    //причины загрузки :)
    loadMoreButton.addEventListener('click', loadProducts);

    loadCategories();
    loadProducts();
});

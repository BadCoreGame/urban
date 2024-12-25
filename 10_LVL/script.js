document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const loadingMessage = document.getElementById('loading-message');
    const addProductForm = document.getElementById('add-product-form');
    const categoryFilter = document.getElementById('category-filter');

    let selectedCategory = '';  //для категории
    let cachedProducts = [];    //кеш для товаров 

    //логика загрузки товаров из api
    const fetchProducts = async (category = '') => {
        try {
            const url = category
                ? `https://fakestoreapi.com/products/category/${category}?limit=6`
                : `https://fakestoreapi.com/products?limit=6`;
            const response = await fetch(url, { keepalive: true });
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            return [];
        }
    };
    //вывод карточек товаров
    const renderProducts = (products) => {
        const fragment = document.createDocumentFragment();
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
            fragment.appendChild(productCard);
        });
        productList.appendChild(fragment);
    };
    //вызов загрузки товаров, запись в кеш Товаров, и изменение стили кнопки
    const loadProducts = async () => {
        loadingMessage.style.display = 'block';
        loadMoreButton.style.display = 'none';

        const products = await fetchProducts(selectedCategory);
        cachedProducts.push(...products);

        loadingMessage.style.display = 'none';
        loadMoreButton.style.display = 'block';
    };
    //загрузка категорий товаров
    const loadCategories = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories', { keepalive: true });
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
    //добавление товара
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

            // Создаем карточку нового товара и добавляем её в начало списка
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = newProduct.id; // Добавляем data-id для идентификации карточки
            productCard.innerHTML = `
                <img src="${newProduct.image}" alt="${newProduct.title}">
                <h3>${newProduct.title}</h3>
                <p>${newProduct.price} $</p>
                <p>${newProduct.description}</p>
                <button onclick="deleteProduct(${newProduct.id})">Удалить товар</button>
            `;
            productList.insertBefore(productCard, productList.firstChild);
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
        }
    };
    //удаление товара
    window.deleteProduct = async (productId) => {
        try {
            await fetch(`https://fakestoreapi.com/products/${productId}`, {method: 'DELETE'});
            alert('Товар успешно удален!');
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {productCard.remove();}
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };
    //обработка формы для добавление товара
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
    // кнопка загрузка следующих товаров
    loadMoreButton.addEventListener('click', () => {
        if (cachedProducts.length > 0) {
            const nextProducts = cachedProducts.splice(0, 7);
            renderProducts(nextProducts);
        }
        loadProducts();
    });
    //действия при выборе категорий
    categoryFilter.addEventListener('change', async(event) => {
        selectedCategory = event.target.value;
        productList.innerHTML = '';
        cachedProducts = [];
        await loadProducts();
        loadMoreButton.click();
    });

    //предзагрузка
    const initialize = async () => {
        await Promise.all([loadCategories(), loadProducts()]);
        loadMoreButton.click();
    };
    initialize();
});

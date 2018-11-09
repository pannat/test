(function($, undefined) {
    var list = document.querySelector(".books__slides");

    $.getJSON('js/test.json', function(test) {
        for (var i in test) {
        //Создадим и заполним карточки
            var card = list.appendChild(createCard(test[i]));
            fillCard(test[i], card);
        }
    });

        //Оживляем слайдер
    var slide = document.getElementsByTagName("li");
    movingCarousel(slide)

    $(list).selectable({
        filter: "li"
    });


    $(list).selectable ({
        selected: function(e, ui) {
     		$(ui.selected).toggleClass("ui-chosen");
     		$(this).find(".ui-chosen").addClass("ui-selected");
            $(".total").addClass("total__show");
            $.getJSON('js/test.json', function(test) {
                var totalFullPrice = 0;
                var totalDiscount = 0;
                var totalPrice = 0;
                for (var k in test) {
                    count = test[k].index;
                    if($("#" + count).hasClass("ui-chosen")) {
                        $("#"+"t" + count).remove()
                        var row = createRow(test[k]);
                        row.id = "t" + count;
                        $(".total__title").after($(row));
                        // Cчитаем полную цену за все выбранные книги
                        totalFullPrice  += +test[k].price;

                        // Cчитаем общую сумму скидки
                        if (test[k].typediscount === "P") {
                            totalDiscount += test[k].price * (test[k].discount / 100);
                        } else {
                            totalDiscount += test[k].price - test[k].discount;
                        }

                        // Cчитаем итоговую цену
                        totalPrice = +totalFullPrice - +totalDiscount;
                    } else {
                        $("#" + "t" + count).remove();
                    }
                }
                $(".total__sum--full").empty();
                $(".total__sum--discount").empty();
                $(".total__sum--price").empty();
                $(".total__sum--full").append(totalFullPrice.toFixed(2) + " &#8381;");
                $(".total__sum--discount").append(totalDiscount.toFixed(2) + " &#8381;");
                $(".total__sum--price").append(totalPrice.toFixed(2) + " &#8381;");
            });

        }
    });

    function createRow(book) {
        // Создадим строку
        var row = document.createElement("tr");
        row.className = "total__item";
        // Создаем и заполним ячейку для наименования
        var cell = document.createElement("td");
        cell.classList.add("total__name");
        cell.innerHTML = book.name;
        row.appendChild(cell);
        // Создаем и заполним ячейку для цены
        var cell = document.createElement("td");
        cell.classList.add("total__price");
        if (book.typediscount === "P") {
            cell.innerHTML = (book.price - book.price * (book.discount / 100)).toFixed(2) + " &#8381;";
        } else {
            cell.innerHTML = (book.price - book.discount).toFixed(2) + " &#8381;";
        }
        row.appendChild(cell);
        return row
    }

    function createCard(book) {
        var item = document.createElement("li");
        item.className = "books__card " + " ui-widget-content";
        item.id = book.index;
        return item
    }

    function fillCard(book, card) {
        // Создаем контейнер для фотографии и помещаем туда саму картинку
        var imageWrapper = document.createElement("p");
        imageWrapper.className = "books__photo";
        var image = document.createElement("img");
        image.setAttribute("src", book.picture);
        card.appendChild(imageWrapper);
        imageWrapper.appendChild(image);

        // Создаем и указываем заголовок
        var title = document.createElement("h2");
        title.className = "books__title";
        title.innerHTML = book.name;
        card.appendChild(title);

        // Создаем абзац для автора и указываем его
        var author = document.createElement("p");
        author.className = "books__author";
        author.innerHTML = book.author.first + " " + book.author.last;
        card.appendChild(author);

        //Создаем абзац для цены без учета скидки и прописываем ее значение
        var fullPrice = document.createElement("p");
        fullPrice.className = "books__price";
        fullPrice.innerHTML = "Цена " + book.price + " &#8381;";
        card.appendChild(fullPrice);

        //Создаем абзац для цены со скидкой
        var discount = document.createElement("p");

        // Рассчитаем размер скидки
        var discountPrice = 0;
        if (book.typediscount === "P") {
            discountPrice = book.price * (book.discount / 100);
        } else {
            discountPrice = book.discount;
        }
        discount.className = "books__discount";
        if (discountPrice !== 0) {
            discount.innerHTML = "Скидка " + discountPrice.toFixed(2) + " &#8381;"
        }
        card.appendChild(discount);
    };

    function movingCarousel(slide) {
        var width = 260;
        var count = 3;
        var slider = document.querySelector('.books__slider');
        var slides = slider.querySelector('.books__slides');
        var position = 0;

        slider.querySelector('.books__button--left').addEventListener("click", function(evt) {
            evt.preventDefault();
            position = Math.min(position + width, 0);
            slides.style.marginLeft = position + 'px';
        });

        slider.querySelector('.books__button--right').addEventListener("click", function(evt) {
            evt.preventDefault();
            position = Math.max(position - width, -width * (slide.length - count));
            slides.style.marginLeft = position + 'px';
        });
    };
})(jQuery);
